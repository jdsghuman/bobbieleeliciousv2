import Image from 'next/image'
import { BlogsPropType, RecipesPropType } from '../../PropTypes/PropTypes'
import { truncateText } from '../../Util/Util'
import RecipeController from '../RecipeController'
import styles from './RecipeDetail.module.scss'

interface RecipeDetailPropTypes {
  post: BlogsPropType | RecipesPropType
}

const RecipeDetail = ({ post }: RecipeDetailPropTypes) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{truncateText(post.fields.title, 60)}</h1>
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
      <RecipeController post={post} />
    </div>
  )
}

export default RecipeDetail
