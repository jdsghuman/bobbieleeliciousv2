import { createClient } from '@sanity/client'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const client = createClient({
  projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Full fields for detail pages
const BLOG_FIELDS = `
  "sys": { "id": _id, "updatedAt": _updatedAt },
  "fields": {
    title,
    "slug": slug.current,
    image,
    description,
    featured,
    publishDate,
    metaDescription,
    "author": author->{
      "sys": { "id": _id },
      "fields": { name, title, shortBio, image, email, phone, company, website, facebook, instagram, twitter }
    },
    "category": category->{ "sys": { "id": _id }, "fields": { name } },
    "tag": tag[]->{ "sys": { "id": _id }, "fields": { name } }
  }
`

const RECIPE_FIELDS = `
  "sys": { "id": _id, "updatedAt": _updatedAt },
  "fields": {
    title,
    "slug": slug.current,
    image,
    description,
    featured,
    publishDate,
    metaDescription,
    prep,
    cooktime,
    servings,
    ingredients,
    recipeDirections,
    recipeNotes,
    tools,
    youtubeLink,
    recipeInstagram,
    "author": author[]->{
      "sys": { "id": _id },
      "fields": { name, title, shortBio, image, email, phone, company, website, facebook, instagram, twitter }
    },
    "category": category->{ "sys": { "id": _id }, "fields": { name } },
    "tag": tag[]->{ "sys": { "id": _id }, "fields": { name } }
  }
`

// Lightweight fields for list/card views — omits detail-only fields
const BLOG_CARD_FIELDS = `
  "sys": { "id": _id },
  "fields": {
    title,
    "slug": slug.current,
    image,
    description,
    publishDate,
    "author": author->{ "sys": { "id": _id }, "fields": { name, image } },
    "category": category->{ "sys": { "id": _id }, "fields": { name } }
  }
`

const RECIPE_CARD_FIELDS = `
  "sys": { "id": _id },
  "fields": {
    title,
    "slug": slug.current,
    image,
    description,
    publishDate,
    "category": category->{ "sys": { "id": _id }, "fields": { name } }
  }
`

interface QueryOptions {
  featured?: boolean
  limit?: number
}

export async function getAllBlogs({ featured, limit }: QueryOptions = {}) {
  const featuredFilter = featured ? ' && featured == true' : ''
  const limitClause = limit ? `[0...${limit}]` : ''
  const blogs = await client.fetch(
    `*[_type == "blogPost"${featuredFilter}] | order(publishDate desc) ${limitClause} { ${BLOG_CARD_FIELDS} }`
  )
  return { blogs: blogs || [] }
}

export async function getAllRecipes({ featured, limit }: QueryOptions = {}) {
  const featuredFilter = featured ? ' && featured == true' : ''
  const limitClause = limit ? `[0...${limit}]` : '[0...200]'
  const recipes = await client.fetch(
    `*[_type == "recipe"${featuredFilter}] | order(publishDate desc) ${limitClause} { ${RECIPE_CARD_FIELDS} }`
  )
  return { recipes: recipes || [] }
}

// Fetches all home page data in a single API call instead of four
export async function getHomePageData() {
  const data = await client.fetch(`{
    "featuredBlogs": *[_type == "blogPost" && featured == true] | order(publishDate desc) { ${BLOG_CARD_FIELDS} },
    "featuredRecipes": *[_type == "recipe" && featured == true] | order(publishDate desc) { ${RECIPE_CARD_FIELDS} },
    "latestBlogs": *[_type == "blogPost"] | order(publishDate desc) [0...3] { ${BLOG_CARD_FIELDS} },
    "latestRecipes": *[_type == "recipe"] | order(publishDate desc) [0...3] { ${RECIPE_CARD_FIELDS} }
  }`)
  return {
    featuredBlogs: data?.featuredBlogs || [],
    featuredRecipes: data?.featuredRecipes || [],
    latestBlogs: data?.latestBlogs || [],
    latestRecipes: data?.latestRecipes || [],
  }
}

// Fetches all blogs and recipes for the search API in a single call
export async function getAllContent() {
  const data = await client.fetch(`{
    "blogs": *[_type == "blogPost"] | order(publishDate desc) { ${BLOG_CARD_FIELDS} },
    "recipes": *[_type == "recipe"] | order(publishDate desc) [0...200] { ${RECIPE_CARD_FIELDS} }
  }`)
  return {
    blogs: (data?.blogs || []).map((b) => ({ ...b, type: 'blog' })),
    recipes: (data?.recipes || []).map((r) => ({ ...r, type: 'recipe' })),
  }
}

export async function getPostBySlug(type: string, slug: string) {
  const sanityType = type === 'blogPost' ? 'blogPost' : 'recipe'
  const fields = sanityType === 'blogPost' ? BLOG_FIELDS : RECIPE_FIELDS
  const result = await client.fetch(`*[_type == $type && slug.current == $slug][0] { ${fields} }`, {
    type: sanityType,
    slug,
  })
  return result
}

export async function getMorePosts(type: string, slug: string) {
  const sanityType = type === 'blogPost' ? 'blogPost' : 'recipe'
  const cardFields = sanityType === 'blogPost' ? BLOG_CARD_FIELDS : RECIPE_CARD_FIELDS
  const results = await client.fetch(
    `*[_type == $type && slug.current != $slug] | order(publishDate desc) [0...3] { ${cardFields} }`,
    { type: sanityType, slug }
  )
  return results || []
}

export async function getAllPostsWithSlug(type: string) {
  const sanityType = type === 'blogPost' ? 'blogPost' : 'recipe'
  const items = await client.fetch(`*[_type == $type] { "fields": { "slug": slug.current } }`, {
    type: sanityType,
  })
  return { items: items || [] }
}

export async function getAllCategories(postType: 'blogPost' | 'recipe') {
  const data = await client.fetch(
    `*[_type == "category" && _id in *[_type == $postType && defined(category)].category._ref] | order(name asc) { "sys": { "id": _id }, "fields": { name } }`,
    { postType }
  )
  return { data: data || [] }
}
