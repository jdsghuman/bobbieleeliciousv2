/* eslint-disable @typescript-eslint/no-var-requires */
const globby = require('globby')
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const fs = require('fs').promises
import { getAllBlogs, getAllRecipes } from '../../lib/index'

// pages that should not be in the sitemap
const blocklist = ['/404']
async function generateSitemap() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Sitemap generation skipped in development mode.')
    return
  }
  const baseUrl = process.env.BASE_URL
  const publicDir = './public'

  try {
    await fs.mkdir(publicDir, { recursive: true })
    console.log('Sitemap successfully written to public/sitemap.xml')
  } catch (err) {
    console.error(`Failed to create public directory: ${err}`)
    return
  }

  const pages = await globby([
    'pages/**/*{.js,.tsx,.ts,.mdx}',
    'pages/*{.js,.tsx,.ts,.mdx}',
    '!pages/**/[*',
    '!pages/_*.js',
    '!pages/_*.ts',
    '!pages/_*.tsx',
    '!pages/api',
  ])
  // normal page routes
  const pageLinks = pages
    .map((page) => {
      const path = page
        .replace('pages', '')
        .replace('.js', '')
        .replace('.ts', '')
        .replace('.tsx', '')
        .replace('.mdx', '')
        .replace('src/', '')
        .replace('indexx', '')
        .replace('index', '')
      return path === '/index'
        ? { url: '/', changefreq: 'daily', priority: 0.7 }
        : { url: path, changefreq: 'daily', priority: 0.7 }
    })
    .filter((page) => !blocklist.includes(page.url))

  const allBlogs = await getAllBlogs()
  const allRecipes = await getAllRecipes()

  const postLinksRecipes = allRecipes?.recipes.map((post) => ({
    url: `recipe/${post.fields.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))
  const postLinksBlogs = allBlogs?.blogs.map((post) => ({
    url: `blog/${post.fields.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))

  // Add static links for main category pages
  const staticLinks = [
    { url: '/', changefreq: 'weekly', priority: 0.7 },
    { url: '/recipes', changefreq: 'weekly', priority: 0.7 },
    { url: '/blogs', changefreq: 'weekly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.6 },
  ]

  const links = [...pageLinks, ...postLinksRecipes, ...postLinksBlogs, ...staticLinks]

  try {
    const stream = new SitemapStream({ hostname: baseUrl })
    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString()
    )
    await fs.writeFile(`${publicDir}/sitemap.xml`, xml)
    console.log('Sitemap successfully written to public/sitemap.xml')
  } catch (err) {
    console.error(`Failed to write sitemap.xml: ${err}`)
  }
}
export default generateSitemap
