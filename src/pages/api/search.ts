import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllContent } from '../../lib/index'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchTerm = ((req.query.searchTerm as string) || '').toLowerCase().trim()
  const categories = ((req.query.categories as string) || '').toLowerCase()

  const { blogs: rawBlogs, recipes: rawRecipes } = await getAllContent()

  const blogs = rawBlogs.map((b: any) => {
    if (typeof b.fields.description === 'string') {
      b.fields.description = b.fields.description.slice(0, 155)
    }
    return b
  })

  const recipes = rawRecipes.map((r: any) => {
    if (typeof r.fields.description === 'string') {
      r.fields.description = r.fields.description.slice(0, 155)
    }
    return r
  })

  const matchesTerm = (title: string) => !searchTerm || title.toLowerCase().includes(searchTerm)
  const matchesCat = (post: any) =>
    !categories || post?.fields?.category?.fields?.name?.toLowerCase().includes(categories)

  const results = [
    ...blogs.filter((b: any) => matchesTerm(b.fields.title) && matchesCat(b)),
    ...recipes.filter((r: any) => matchesTerm(r.fields.title) && matchesCat(r)),
  ]

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600')
  res.status(200).json({ results })
}
