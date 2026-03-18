import { useEffect, useState } from 'react'
import styles from './RecipeReviews.module.scss'

interface Review {
  id: string
  slug: string
  rating: number
  reviewer_name: string
  review_text: string | null
  created_at: string
}

interface Props {
  slug: string
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
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= (interactive ? hovered || rating : rating)
              ? styles.star__filled
              : styles.star__empty
          }
          onClick={() => interactive && onSelect && onSelect(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${n} star${n !== 1 ? 's' : ''}` : undefined}
        >
          {n <= (interactive ? hovered || rating : rating) ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

const RecipeReviews = ({ slug }: Props) => {
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

  useEffect(() => {
    fetch(`/api/reviews/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load reviews.')
        setLoading(false)
      })
  }, [slug])

  const averageRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
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
      setReviews([newReview, ...reviews])
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

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Reviews</h3>

      {reviews.length > 0 && (
        <div className={styles.summary}>
          <StarRating rating={Math.round(averageRating)} />
          <span className={styles.summary__text}>
            {averageRating} out of 5 &mdash; {reviews.length} review
            {reviews.length !== 1 ? 's' : ''}
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
              Email <span aria-hidden>*</span>
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

      {!loading && reviews.length === 0 && (
        <p className={styles.status}>No reviews yet. Be the first!</p>
      )}

      <div className={styles.list}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <div className={styles.review__header}>
              <strong className={styles.review__name}>{review.reviewer_name}</strong>
              <StarRating rating={review.rating} />
              <span className={styles.review__date}>
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            {review.review_text && <p className={styles.review__text}>{review.review_text}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeReviews
