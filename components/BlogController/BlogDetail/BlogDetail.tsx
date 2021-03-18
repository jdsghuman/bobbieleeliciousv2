import { truncateText } from '../../Util/Util'
import BlogDescription from './BlogDescription/BlogDescription'
import { BlogPropType } from '../../PropTypes/PropTypes'
import AuthorItem from '../../Author/AuthorItem'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import styles from './BlogDetail.module.scss'

const BlogDetail = ({ blog }: BlogPropType) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{truncateText(blog.fields.title, 40)}</h1>
      <div className={styles['container--blog--icons']}>
        <AuthorItem blog={blog} />
        <ShareIconItem postImage={blog.fields.image} postName={blog.fields.title} />
      </div>
      <img src={blog.fields.image} alt={blog.fields.title} className={styles['image--main']} />
      <BlogDescription blog={blog} />
    </div>
  )
}

export default BlogDetail
