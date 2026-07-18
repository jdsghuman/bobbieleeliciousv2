import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './RecipeReviews.module.scss'

interface Review {
  id: string
  slug: string
  rating: number | null
  reviewer_name: string
  review_text: string | null
  created_at: string
  parent_id: string | null
  is_owner_reply: boolean
}

const OWNER_SECRET_STORAGE_KEY = 'bobbielee_review_owner_secret'

interface Props {
  slug: string
  onReviewsChange?: (ratingValue: number | null, ratingCount: number) => void
}

const StarRating = ({
  rating,
  interactive,
  onSelect,
}: {
  rating: number
  interactive?: boolean
  onSelect?: (r: number) => void
}) => {
  const [hovered, setHovered] = useState(0)

  return (
    <span className={styles.stars} aria-hidden={!interactive || undefined}>
      {[1, 2, 3, 4, 5].map((n) => {
        const isFilled = n <= (interactive ? hovered || rating : rating)
        if (interactive) {
          return (
            <button
              key={n}
              type="button"
              className={isFilled ? styles.star__filled : styles.star__empty}
              onClick={() => onSelect && onSelect(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${n} star${n !== 1 ? 's' : ''}`}
            >
              {isFilled ? '★' : '☆'}
            </button>
          )
        }
        return (
          <span key={n} className={isFilled ? styles.star__filled : styles.star__empty}>
            {isFilled ? '★' : '☆'}
          </span>
        )
      })}
    </span>
  )
}

const RecipeReviews = ({ slug, onReviewsChange }: Props) => {
  const router = useRouter()
  const isOwnerView = router.query.owner === '1'

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')

  const [replyOpenId, setReplyOpenId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [ownerSecret, setOwnerSecret] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [replyError, setReplyError] = useState('')

  useEffect(() => {
    setOwnerSecret(localStorage.getItem(OWNER_SECRET_STORAGE_KEY) || '')
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    setSubmitError('')
    setSubmitted(false)
    setReviews([])
    setRating(0)
    setName('')
    setEmail('')
    setText('')
    fetch(`/api/reviews/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load reviews.')
        return r.json()
      })
      .then((data) => {
        const loaded: Review[] = Array.isArray(data) ? data : []
        setReviews(loaded)
        setLoading(false)
        if (onReviewsChange) {
          const rated = loaded.filter((r) => !r.parent_id)
          const avg =
            rated.length > 0
              ? Math.round(
                  (rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length) * 10
                ) / 10
              : null
          onReviewsChange(avg, rated.length)
        }
      })
      .catch(() => {
        setError('Failed to load reviews.')
        setLoading(false)
      })
  }, [slug, onReviewsChange])

  const topLevelReviews = reviews.filter((r) => !r.parent_id)
  const repliesByParent = reviews.reduce<Record<string, Review[]>>((acc, r) => {
    if (r.parent_id) {
      acc[r.parent_id] = [...(acc[r.parent_id] || []), r]
    }
    return acc
  }, {})

  const averageRating =
    topLevelReviews.length > 0
      ? Math.round(
          (topLevelReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / topLevelReviews.length) *
            10
        ) / 10
      : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (rating === 0) {
      setSubmitError('Please select a star rating.')
      return
    }
    if (!name.trim()) {
      setSubmitError('Please enter your name.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/reviews/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          rating,
          reviewer_name: name,
          reviewer_email: email || null,
          review_text: text || null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setSubmitError(err.error || 'Failed to submit review.')
        setSubmitting(false)
        return
      }

      const newReview: Review = await res.json()
      const updatedReviews = [newReview, ...reviews]
      setReviews(updatedReviews)
      if (onReviewsChange) {
        const rated = updatedReviews.filter((r) => !r.parent_id)
        const avg =
          Math.round((rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length) * 10) / 10
        onReviewsChange(avg, rated.length)
      }
      setRating(0)
      setName('')
      setEmail('')
      setText('')
      setSubmitted(true)
    } catch {
      setSubmitError('Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentId: string) => {
    setReplyError('')

    if (!replyText.trim()) {
      setReplyError('Please enter a reply.')
      return
    }
    if (!ownerSecret.trim()) {
      setReplyError('Please enter the owner secret.')
      return
    }

    setReplySubmitting(true)

    try {
      const res = await fetch(`/api/reviews/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_id: parentId,
          review_text: replyText,
          owner_secret: ownerSecret,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setReplyError(err.error || 'Failed to submit reply.')
        setReplySubmitting(false)
        return
      }

      const newReply: Review = await res.json()
      setReviews([...reviews, newReply])
      localStorage.setItem(OWNER_SECRET_STORAGE_KEY, ownerSecret)
      setReplyText('')
      setReplyOpenId(null)
    } catch {
      setReplyError('Failed to submit reply.')
    } finally {
      setReplySubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Reviews</h3>

      {topLevelReviews.length > 0 && (
        <div className={styles.summary}>
          <StarRating rating={Math.round(averageRating)} />
          <span className={styles.summary__text}>
            {averageRating} out of 5 &mdash; {topLevelReviews.length} review
            {topLevelReviews.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {submitted && <p className={styles.status}>Thanks for your review!</p>}
      {!submitted && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form__field}>
            <span className={styles.form__label}>Your rating</span>
            <StarRating rating={rating} interactive onSelect={setRating} />
          </div>
          <div className={styles.form__field}>
            <label className={styles.form__label} htmlFor="reviewer-name">
              Name <span aria-hidden>*</span>
            </label>
            <input
              id="reviewer-name"
              className={styles.form__input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.form__field}>
            <label className={styles.form__label} htmlFor="reviewer-email">
              Email <span aria-hidden>*</span>{' '}
              <span className={styles.form__private}>(Kept private)</span>
            </label>
            <input
              id="reviewer-email"
              className={styles.form__input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.form__field}>
            <label className={styles.form__label} htmlFor="review-text">
              Review <span className={styles.form__optional}>(optional)</span>
            </label>
            <textarea
              id="review-text"
              className={styles.form__textarea}
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          {submitError && <p className={styles.error}>{submitError}</p>}
          <button className={styles.button} type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      )}

      {loading && <p className={styles.status}>Loading reviews…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && topLevelReviews.length === 0 && (
        <p className={styles.status}>No reviews yet. Be the first!</p>
      )}

      <div className={styles.list}>
        {topLevelReviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <div className={styles.review__header}>
              <strong className={styles.review__name}>{review.reviewer_name}</strong>
              {review.rating != null && <StarRating rating={review.rating} />}
              <span className={styles.review__date}>
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            {review.review_text && <p className={styles.review__text}>{review.review_text}</p>}

            {(repliesByParent[review.id] || []).map((reply) => (
              <div key={reply.id} className={styles.reply}>
                <div className={styles.review__header}>
                  <strong className={styles.review__name}>{reply.reviewer_name}</strong>
                  <span className={styles.reply__badge}>Author reply</span>
                  <span className={styles.review__date}>
                    {new Date(reply.created_at).toLocaleDateString()}
                  </span>
                </div>
                {reply.review_text && <p className={styles.review__text}>{reply.review_text}</p>}
              </div>
            ))}

            {isOwnerView && (
              <div className={styles.replyAction}>
                {replyOpenId === review.id ? (
                  <div className={styles.replyForm}>
                    <input
                      className={styles.form__input}
                      type="password"
                      placeholder="Owner secret"
                      value={ownerSecret}
                      onChange={(e) => setOwnerSecret(e.target.value)}
                    />
                    <textarea
                      className={styles.form__textarea}
                      rows={3}
                      placeholder="Write a reply…"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    {replyError && <p className={styles.error}>{replyError}</p>}
                    <div className={styles.replyForm__actions}>
                      <button
                        type="button"
                        className={styles.button}
                        disabled={replySubmitting}
                        onClick={() => handleReplySubmit(review.id)}
                      >
                        {replySubmitting ? 'Posting…' : 'Post reply'}
                      </button>
                      <button
                        type="button"
                        className={styles.replyCancel}
                        onClick={() => {
                          setReplyOpenId(null)
                          setReplyError('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.replyToggle}
                    onClick={() => setReplyOpenId(review.id)}
                  >
                    Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeReviews
