/* eslint-disable @typescript-eslint/no-var-requires */
const globby = require('globby')
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const fs = require('fs')
import { getAllPosts } from '../../lib/index'

// pages that should not be in the sitemap
const blocklist = ['/404']
async function generateSitemap() {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  const baseUrl = process.env.BASE_URL
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

  const allPosts = await getAllPosts()
  const blogs = allPosts?.blogs
  const recipes = allPosts?.recipes

  const postLinksRecipes = recipes.map((post) => ({
    url: `recipe/${post.fields.slug}`,
    changefreq: 'daily',
    priority: 0.7,
  }))
  const postLinksBlogs = blogs.map((post) => ({
    url: `blog/${post.fields.slug}`,
    changefreq: 'daily',
    priority: 0.7,
  }))

  const links = [...pageLinks, ...postLinksRecipes, ...postLinksBlogs]
  const stream = new SitemapStream({ hostname: baseUrl })
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  )
  fs.writeFileSync('./public/sitemap.xml', xml)
}
export default generateSitemap
