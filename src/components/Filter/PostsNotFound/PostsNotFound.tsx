import styles from './PostsNotFound.module.scss'

interface PostsNotFoundPropType {
  postType: string
}

const searchType = {
  recipe: 'recipes',
  blog: 'blogs',
  post: 'posts',
}

const PostsNotFound = ({ postType }: PostsNotFoundPropType) => {
  return (
    <div className={styles.container}>
      <p className={styles['posts--none']}>No {searchType[postType]} found</p>
    </div>
  )
}

export default PostsNotFound
