import { useEffect, useState } from 'react'
import styles from './BlogComments.module.scss'

interface Comment {
  id: string
  slug: string
  commenter_name: string
  comment_text: string
  created_at: string
}

interface Props {
  slug: string
}

const BlogComments = ({ slug }: Props) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load comments.')
        setLoading(false)
      })
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!name.trim()) {
      setSubmitError('Please enter your name.')
      return
    }
    if (!text.trim()) {
      setSubmitError('Please enter a comment.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          commenter_name: name,
          commenter_email: email || null,
          comment_text: text,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setSubmitError(err.error || 'Failed to submit comment.')
        setSubmitting(false)
        return
      }

      const newComment: Comment = await res.json()
      setComments([newComment, ...comments])
      setName('')
      setEmail('')
      setText('')
    } catch {
      setSubmitError('Failed to submit comment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Comments</h3>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="commenter-name">
            Name <span aria-hidden>*</span>
          </label>
          <input
            id="commenter-name"
            className={styles.form__input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="commenter-email">
            Email <span className={styles.form__optional}>(optional, never shown)</span>
          </label>
          <input
            id="commenter-email"
            className={styles.form__input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.form__field}>
          <label className={styles.form__label} htmlFor="comment-text">
            Comment <span aria-hidden>*</span>
          </label>
          <textarea
            id="comment-text"
            className={styles.form__textarea}
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        {submitError && <p className={styles.error}>{submitError}</p>}
        <button className={styles.button} type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Post comment'}
        </button>
      </form>

      {loading && <p className={styles.status}>Loading comments…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && comments.length === 0 && (
        <p className={styles.status}>No comments yet. Be the first!</p>
      )}

      <div className={styles.list}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.comment__header}>
              <strong className={styles.comment__name}>{comment.commenter_name}</strong>
              <span className={styles.comment__date}>
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className={styles.comment__text}>{comment.comment_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogComments
