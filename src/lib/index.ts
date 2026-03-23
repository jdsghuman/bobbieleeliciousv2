import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'avs8mde7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Shapes a blog post to match the existing post.fields.xxx structure used throughout components
const BLOG_FIELDS = `
  "sys": { "id": _id },
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

// Shapes a recipe to match the existing post.fields.xxx structure used throughout components
const RECIPE_FIELDS = `
  "sys": { "id": _id },
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

interface QueryOptions {
  featured?: boolean
  limit?: number
}

export async function getAllBlogs({ featured, limit }: QueryOptions = {}) {
  const featuredFilter = featured ? ' && featured == true' : ''
  const limitClause = limit ? `[0...${limit}]` : ''
  const blogs = await client.fetch(
    `*[_type == "blogPost"${featuredFilter}] | order(publishDate desc) ${limitClause} { ${BLOG_FIELDS} }`
  )
  return { blogs: blogs || [] }
}

export async function getAllRecipes({ featured, limit }: QueryOptions = {}) {
  const featuredFilter = featured ? ' && featured == true' : ''
  const limitClause = limit ? `[0...${limit}]` : '[0...200]'
  const recipes = await client.fetch(
    `*[_type == "recipe"${featuredFilter}] | order(publishDate desc) ${limitClause} { ${RECIPE_FIELDS} }`
  )
  return { recipes: recipes || [] }
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
  const fields = sanityType === 'blogPost' ? BLOG_FIELDS : RECIPE_FIELDS
  const results = await client.fetch(
    `*[_type == $type && slug.current != $slug] | order(publishDate desc) [0...3] { ${fields} }`,
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

export async function getAllCategories(_type: string) {
  // Both categoryBlogs and category (recipes) are merged into one 'category' type in Sanity
  const data = await client.fetch(
    `*[_type == "category"] | order(name asc) { "sys": { "id": _id }, "fields": { name } }`
  )
  return { data: data || [] }
}
