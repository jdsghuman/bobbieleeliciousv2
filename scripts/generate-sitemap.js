/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs').promises
const { Readable } = require('stream')
const globby = require('globby')
const { SitemapStream, streamToPromise } = require('sitemap')
const contentful = require('contentful')

const blocklist = ['/404']

const client = contentful.createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})

async function getAllBlogs() {
  try {
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
      select: 'fields.slug',
    })

    return response.items || []
  } catch (error) {
    console.log(error)
    return []
  }
}

async function getAllRecipes() {
  try {
    const response = await client.getEntries({
      content_type: 'recipe',
      order: '-fields.publishDate',
      select: 'fields.slug',
      limit: 200,
    })

    return response.items || []
  } catch (error) {
    console.log(error)
    return []
  }
}

function toRoute(pagePath) {
  const route = pagePath
    .replace(/^src\/pages/, '')
    .replace(/\.(js|ts|tsx|mdx)$/, '')
    .replace(/\/index$/, '')

  return route.length > 0 ? route : '/'
}

function dedupeByUrl(links) {
  const seen = new Set()

  return links.filter((link) => {
    if (seen.has(link.url)) {
      return false
    }

    seen.add(link.url)
    return true
  })
}

async function generateSitemap() {
  const baseUrl = process.env.BASE_URL || 'https://www.bobbieleelicious.com'
  if (!process.env.BASE_URL) {
    console.warn('BASE_URL is not set. Falling back to https://www.bobbieleelicious.com')
  }

  const publicDir = path.join(process.cwd(), 'public')
  await fs.mkdir(publicDir, { recursive: true })

  const pages = await globby([
    'src/pages/**/*{.js,.tsx,.ts,.mdx}',
    'src/pages/*{.js,.tsx,.ts,.mdx}',
    '!src/pages/**/[[]*[]].{js,ts,tsx,mdx}',
    '!src/pages/**/[[]*[]]/**',
    '!src/pages/_*.js',
    '!src/pages/_*.ts',
    '!src/pages/_*.tsx',
    '!src/pages/api/**',
  ])

  const pageLinks = pages
    .map((page) => ({
      url: toRoute(page),
      changefreq: 'daily',
      priority: 0.7,
    }))
    .filter((page) => !blocklist.includes(page.url))
    .filter((page) => !page.url.includes('['))

  const [blogs, recipes] = await Promise.all([getAllBlogs(), getAllRecipes()])

  const postLinksRecipes = recipes.map((post) => ({
    url: `/recipe/${post.fields.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))

  const postLinksBlogs = blogs.map((post) => ({
    url: `/blog/${post.fields.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))

  const staticLinks = [
    { url: '/', changefreq: 'weekly', priority: 0.7 },
    { url: '/recipes', changefreq: 'weekly', priority: 0.7 },
    { url: '/blogs', changefreq: 'weekly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.6 },
  ]

  const links = dedupeByUrl([...pageLinks, ...postLinksRecipes, ...postLinksBlogs, ...staticLinks])

  const stream = new SitemapStream({ hostname: baseUrl })
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  )

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml)
  console.log('Sitemap successfully written to public/sitemap.xml')
}

generateSitemap().catch((error) => {
  console.error(`Failed to generate sitemap.xml: ${error}`)
  process.exit(1)
})
