import ReactMarkdown from 'react-markdown'
import AuthorItem from '../../../Author/AuthorItem'
import { BlogPropType } from '../../../PropTypes/PropTypes'
import styles from './BlogDescription.module.scss'

const BlogDescription = ({ blog }: BlogPropType) => {
  console.log('blog in description', blog)

  return (
    <div className={styles.container}>
      <ReactMarkdown className={styles.markdown} source={blog.fields.description} />
      <AuthorItem blog={blog} />
    </div>
  )
}

export default BlogDescription
