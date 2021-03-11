import { BlogsPropType, RecipesPropType } from '../PropTypes/PropTypes'
import { truncateText } from '../Util/Util'
import RecipeController from '../RecipeController/RecipeController'
import styles from './PostDetail.module.scss'

interface PostDetailPropTypes {
  post: BlogsPropType | RecipesPropType
}

const PostDetail = ({ post }: PostDetailPropTypes) => {
  console.log('recipe in PostDetail----', post)
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{truncateText(post.fields.title, 40)}</h2>
      <img src={post.fields.image} alt={post.fields.title} className={styles['image--main']} />
      <RecipeController post={post} />
    </div>
  )
}

export default PostDetail
