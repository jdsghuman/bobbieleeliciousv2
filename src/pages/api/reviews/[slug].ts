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
      .select('id, slug, rating, reviewer_name, review_text, created_at, parent_id, is_owner_reply')
      .eq('slug', slug)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { rating, reviewer_name, reviewer_email, review_text, parent_id, owner_secret } = req.body

    if (parent_id) {
      if (typeof parent_id !== 'string') {
        return res.status(400).json({ error: 'parent_id must be a string' })
      }
      if (!process.env.REVIEW_OWNER_SECRET || owner_secret !== process.env.REVIEW_OWNER_SECRET) {
        return res.status(401).json({ error: 'Not authorized to reply.' })
      }
      if (!review_text || typeof review_text !== 'string' || review_text.trim() === '') {
        return res.status(400).json({ error: 'review_text is required' })
      }

      const { data: parentRows, error: parentError } = await supabase
        .from('recipe_reviews')
        .select('id, slug, parent_id')
        .eq('id', parent_id)
        .limit(1)

      if (parentError) return res.status(500).json({ error: parentError.message })

      const parent = parentRows?.[0]
      if (!parent || parent.slug !== slug || parent.parent_id) {
        return res.status(400).json({ error: 'Invalid parent review.' })
      }

      const { data, error } = await supabase
        .from('recipe_reviews')
        .insert({
          slug,
          rating: null,
          reviewer_name: reviewer_name?.trim() || 'Bobbielee',
          reviewer_email: null,
          review_text: review_text.trim(),
          parent_id,
          is_owner_reply: true,
        })
        .select(
          'id, slug, rating, reviewer_name, review_text, created_at, parent_id, is_owner_reply'
        )
        .single()

      if (error) return res.status(500).json({ error: error.message })
      return res.status(201).json(data)
    }

    if (!reviewer_name || typeof reviewer_name !== 'string' || reviewer_name.trim() === '') {
      return res.status(400).json({ error: 'reviewer_name is required' })
    }

    const parsedRating = Number(rating)
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' })
    }

    if (review_text != null && typeof review_text !== 'string') {
      return res.status(400).json({ error: 'review_text must be a string' })
    }
    const normalizedReviewText = review_text?.trim() || null

    const { data, error } = await supabase
      .from('recipe_reviews')
      .insert({
        slug,
        rating: parsedRating,
        reviewer_name: reviewer_name.trim(),
        reviewer_email: reviewer_email || null,
        review_text: normalizedReviewText,
      })
      .select('id, slug, rating, reviewer_name, review_text, created_at, parent_id, is_owner_reply')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
