import classNames from 'classnames/bind'
import styles from './RecipeDescription.module.scss'
import ReactMarkdown from 'react-markdown'
import VideoDetail from '../VideoDetail/VideoDetail'

const cx = classNames.bind(styles)

const RecipeDescription = ({ post }) => {
  return (
    <div className={styles.container}>
      <ReactMarkdown className={styles.markdown} source={post.fields.description} />
      {post?.fields?.youtubeLink && (
        <div className={cx('markdown', 'markdown__video')}>
          <VideoDetail url={post.fields.youtubeLink} />
        </div>
      )}
      {post?.fields?.recipeNotes && (
        <p className={cx('markdown', 'markdown__notes')}>
          <span className={styles.markdown__notes__description}>Notes: </span>
          {post.fields.recipeNotes}
        </p>
      )}
      {post?.fields?.tools && (
        <p className={cx('markdown', 'markdown__tools')}>
          <span className={styles.markdown__notes__description}>Tools: </span>
          <ReactMarkdown>{post.fields.tools}</ReactMarkdown>
        </p>
      )}
    </div>
  )
}

export default RecipeDescription
