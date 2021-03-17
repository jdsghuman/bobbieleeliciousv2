import { truncateText } from '../../Util/Util'
import BlogDescription from './BlogDescription/BlogDescription'
import { BlogPropType } from '../../PropTypes/PropTypes'
import styles from './BlogDetail.module.scss'

const BlogDetail = ({ blog }: BlogPropType) => {
  console.log('post in BlogDetail----', blog)
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{truncateText(blog.fields.title, 40)}</h1>
      <img src={blog.fields.image} alt={blog.fields.title} className={styles['image--main']} />
      <BlogDescription blog={blog} />
    </div>
  )
}

export default BlogDetail
