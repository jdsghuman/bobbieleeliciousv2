import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('recipe_reviews')
      .select('id, slug, rating, reviewer_name, review_text, created_at')
      .eq('slug', slug)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { rating, reviewer_name, reviewer_email, review_text } = req.body

    if (!reviewer_name || typeof reviewer_name !== 'string' || reviewer_name.trim() === '') {
      return res.status(400).json({ error: 'reviewer_name is required' })
    }

    const parsedRating = Number(rating)
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' })
    }

    const { data, error } = await supabase
      .from('recipe_reviews')
      .insert({
        slug,
        rating: parsedRating,
        reviewer_name: reviewer_name.trim(),
        reviewer_email: reviewer_email || null,
        review_text,
      })
      .select('id, slug, rating, reviewer_name, review_text, created_at')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
