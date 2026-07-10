import { useState } from 'react'
import Image from 'next/image'
import { BlogsPropType, RecipesPropType } from '../../PropTypes/PropTypes'
import { truncateText } from '../../Util/Util'
import RecipeController from '../RecipeController'
import styles from './RecipeDetail.module.scss'

interface RecipeDetailPropTypes {
  post: BlogsPropType | RecipesPropType
  ratingValue?: number | null
  ratingCount?: number
}

const StarRating = ({ rating }: { rating: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= rating ? styles.star__filled : styles.star__empty}>
        {n <= rating ? '★' : '☆'}
      </span>
    ))}
  </span>
)

const RecipeDetail = ({
  post,
  ratingValue: initialRatingValue,
  ratingCount: initialRatingCount,
}: RecipeDetailPropTypes) => {
  const [ratingValue, setRatingValue] = useState(initialRatingValue ?? null)
  const [ratingCount, setRatingCount] = useState(initialRatingCount ?? 0)

  const handleReviewsChange = (newRatingValue: number | null, newRatingCount: number) => {
    setRatingValue(newRatingValue)
    setRatingCount(newRatingCount)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{truncateText(post.fields.title, 60)}</h1>
      {ratingValue !== null && ratingCount > 0 && (
        <div className={styles.rating}>
          <StarRating rating={Math.round(ratingValue)} />
          <span className={styles.rating__text}>
            {ratingValue} ({ratingCount} review{ratingCount !== 1 ? 's' : ''})
          </span>
        </div>
      )}
      {post?.fields.image ? (
        <Image
          src={post.fields.image}
          alt={post.fields.title}
          width={500}
          height={400}
          className={styles['image--main']}
          priority
          unoptimized
        />
      ) : (
        <div className={styles['image--main--error']}>
          <p className={styles['image--main--error__text']}>Image failed to load</p>
        </div>
      )}
      <RecipeController post={post} onReviewsChange={handleReviewsChange} />
    </div>
  )
}

export default RecipeDetail
