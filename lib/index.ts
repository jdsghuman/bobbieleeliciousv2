// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})

export async function getAllPosts() {
  const blogs = await client
    .getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
    })
    .then((response) => response.items)

  const recipes = await client
    .getEntries({
      content_type: 'recipe',
      order: '-fields.publishDate',
    })
    .then((response) => response.items)

  if (blogs && recipes) {
    return {
      blogs,
      recipes,
    }
  }
}

export async function getAllBlogs() {
  const blogs = await client
    .getEntries({
      content_type: 'blogPost',
      order: '-fields.publishDate',
    })
    .then((response) => response.items)

  if (blogs) {
    return {
      blogs,
    }
  }
}

export async function getAllRecipes() {
  const recipes = await client
    .getEntries({
      content_type: 'recipe',
      order: '-fields.publishDate',
    })
    .then((response) => response.items)

  if (recipes) {
    return {
      recipes,
    }
  }
}

export async function getPostBySlug(type, slug) {
  const data = await client.getEntries({
    content_type: type,
    'fields.slug': slug,
  })

  return data.items[0]
}

export async function getMorePosts(type, slug) {
  const data = await client.getEntries({
    content_type: type,
    limit: 3,
    order: '-fields.publishDate',
    'fields.slug': slug,
  })

  return data ? data : null
}

export async function getAllPostsWithSlug(type) {
  const data = await client.getEntries({
    content_type: type,
  })

  return data
}
