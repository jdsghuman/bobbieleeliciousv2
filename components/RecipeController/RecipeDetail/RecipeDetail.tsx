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
      <h1 className={styles.title}>{truncateText(post.fields.title, 40)}</h1>
      {post?.fields.image ? (
        <img src={post.fields.image} alt={post.fields.title} className={styles['image--main']} />
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
