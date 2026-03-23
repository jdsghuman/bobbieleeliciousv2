import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})

const CACHE_FILE = path.join(process.cwd(), '.contentful-cache.json')
const isDev = process.env.NODE_ENV === 'development'

function readCache(): Record<string, any> {
  if (!fs.existsSync(CACHE_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function writeCache(cache: Record<string, any>) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!isDev) return fetcher()

  const cache = readCache()
  if (cache[key] !== undefined) return cache[key] as T

  const result = await fetcher()
  // Don't cache null/undefined — could be a blocked or failed API response
  if (result != null) {
    cache[key] = result
    writeCache(cache)
  }
  return result
}

// Note: response is limited to 100 posts
// export async function getAllPosts() {
//   const blogs = await client
//     .getEntries({
//       content_type: 'blogPost',
//       order: '-fields.publishDate',
//     })
//     .then((response) => response.items)

//   const recipes = await client
//     .getEntries({
//       content_type: 'recipe',
//       order: '-fields.publishDate',
//     })
//     .then((response) => response.items)

//   if (blogs && recipes) {
//     return {
//       blogs,
//       recipes,
//     }
//   }
// }

interface QueryOptions {
  featured?: boolean
  limit?: number
}

export async function getAllBlogs({ featured, limit }: QueryOptions = {}) {
  const cacheKey = `getAllBlogs:${featured ?? ''}:${limit ?? ''}`
  return cachedFetch(cacheKey, async () => {
    try {
      const query: Record<string, any> = {
        content_type: 'blogPost',
        order: '-fields.publishDate',
        select:
          'fields.title, fields.description, fields.image, fields.slug, fields.featured, fields.publishDate, fields.author, fields.category, fields.metaDescription',
      }
      if (featured) query['fields.featured'] = true
      if (limit) query.limit = limit

      const response = await client.getEntries(query)

      return {
        blogs: response.items || [],
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  })
}

export async function getAllRecipes({ featured, limit }: QueryOptions = {}) {
  const cacheKey = `getAllRecipes:${featured ?? ''}:${limit ?? ''}`
  return cachedFetch(cacheKey, async () => {
    try {
      const query: Record<string, any> = {
        content_type: 'recipe',
        order: '-fields.publishDate',
        select:
          'fields.title, fields.description, fields.image, fields.slug, fields.featured, fields.publishDate, fields.author, fields.category, fields.metaDescription',
      }
      if (featured) query['fields.featured'] = true
      query.limit = limit ?? 200

      const response = await client.getEntries(query)

      return {
        recipes: response.items || [],
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  })
}

export async function getPostBySlug(type, slug) {
  return cachedFetch(`getPostBySlug:${type}:${slug}`, async () => {
    const data = await client.getEntries({
      content_type: type,
      'fields.slug': slug,
    })
    return data.items[0]
  })
}

// get more 3 latest posts
export async function getMorePosts(type, slug) {
  return cachedFetch(`getMorePosts:${type}:${slug}`, async () => {
    const entries = await client.getEntries({
      content_type: type,
      limit: 3,
      order: '-fields.publishDate',
      'fields.slug[nin]': slug,
    })

    if (entries.items) {
      return entries.items
    }
    console.log(`Error getting Entries.`)
  })
}

//

export async function getAllPostsWithSlug(type) {
  return cachedFetch(`getAllPostsWithSlug:${type}`, async () => {
    const data = await client.getEntries({
      content_type: type,
    })
    return data
  })
}

export async function getAllCategories(type) {
  return cachedFetch(`getAllCategories:${type}`, async () => {
    const data = await client
      .getEntries({
        content_type: type,
      })
      .then((response) => response.items)

    if (data) {
      return {
        data,
      }
    }
  })
}
