import classNames from 'classnames/bind'
import styles from './RecipeDescription.module.scss'
import ReactMarkdown from 'react-markdown'

const cx = classNames.bind(styles)

const RecipeDescription = ({ post }) => {
  const getRecipeTools = (tools) => {
    const toolsArr = tools.split('--')
    return toolsArr.map((tool, i) => {
      return <p key={i}>{tool}</p>
    })
  }
  return (
    <div className={styles.container}>
      <ReactMarkdown className={styles.markdown} source={post.fields.description} />
      {post?.fields?.recipeNotes && (
        <p className={cx('markdown', 'markdown__notes')}>
          <span className={styles.markdown__notes__description}>Notes: </span>
          {post.fields.recipeNotes}
        </p>
      )}
      {post?.fields?.tools && (
        <p className={cx('markdown', 'markdown__tools')}>
          <span className={styles.markdown__notes__description}>Tools: </span>
          {getRecipeTools(post.fields.tools)}
        </p>
      )}
    </div>
  )
}

export default RecipeDescription
