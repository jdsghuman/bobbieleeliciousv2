import FilterApplied from '../FilterApplied/FilterApplied'
import styles from './PostsNotFound.module.scss'

interface PostsNotFoundPropType {
  postType?: string
}

const PostsNotFound = ({ postType }: PostsNotFoundPropType) => {
  return (
    <div className={styles.container}>
      <FilterApplied />
      <p className={styles['posts--none']}>
        No {postType === 'recipe' ? 'recipes' : 'blogs'} found
      </p>
    </div>
  )
}

export default PostsNotFound
