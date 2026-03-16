import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllBlogs, getAllRecipes } from '../../lib/index'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerm = ((req.query.searchTerm as string) || '').toLowerCase().trim()
  const categories = ((req.query.categories as string) || '').toLowerCase()

  const [blogsData, recipesData] = await Promise.all([getAllBlogs(), getAllRecipes()])

  const blogs = blogsData.blogs.map((b: any) => {
    if (typeof b.fields.description === 'string') {
      b.fields.description = b.fields.description.slice(0, 155)
    }
    b.type = 'blog'
    return b
  })

  const recipes = recipesData.recipes.map((r: any) => {
    if (typeof r.fields.description === 'string') {
      r.fields.description = r.fields.description.slice(0, 155)
    }
    r.type = 'recipe'
    return r
  })

  const matchesTerm = (title: string) => !searchTerm || title.toLowerCase().includes(searchTerm)
  const matchesBlogCat = (b: any) =>
    !categories || b?.fields?.category?.[0]?.fields?.name?.toLowerCase().includes(categories)
  const matchesRecipeCat = (r: any) =>
    !categories || r?.fields?.category?.fields?.name?.toLowerCase().includes(categories)

  const results = [
    ...blogs.filter((b: any) => matchesTerm(b.fields.title) && matchesBlogCat(b)),
    ...recipes.filter((r: any) => matchesTerm(r.fields.title) && matchesRecipeCat(r)),
  ]

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  res.status(200).json({ results })
}
