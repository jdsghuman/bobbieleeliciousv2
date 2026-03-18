import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Missing slug' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, slug, commenter_name, comment_text, created_at')
      .eq('slug', slug)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { commenter_name, commenter_email, comment_text } = req.body

    if (!commenter_name || typeof commenter_name !== 'string' || commenter_name.trim() === '') {
      return res.status(400).json({ error: 'commenter_name is required' })
    }

    if (!comment_text || typeof comment_text !== 'string' || comment_text.trim() === '') {
      return res.status(400).json({ error: 'comment_text is required' })
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        slug,
        commenter_name: commenter_name.trim(),
        commenter_email: commenter_email || null,
        comment_text: comment_text.trim(),
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
