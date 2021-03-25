import FilterApplied from '../FilterApplied/FilterApplied'
import styles from './PostsNotFound.module.scss'

const PostsNotFound = () => {
  return (
    <div className={styles.container}>
      <FilterApplied />
      <p className={styles['posts--none']}>No recipes found</p>
    </div>
  )
}

export default PostsNotFound
