import Image from 'next/image'
import { truncateText } from '../../Util/Util'
import BlogDescription from './BlogDescription'
import { BlogPropType } from '../../PropTypes/PropTypes'
import AuthorItem from '../../Author'
import ShareIconItem from '../../SocialMedia/ShareIcons/ShareIconItem'
import styles from './BlogDetail.module.scss'

const BlogDetail = ({ blog }: BlogPropType) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{truncateText(blog.fields.title, 80)}</h1>
      <div className={styles['container--blog--icons']}>
        <AuthorItem blog={blog} />
        <ShareIconItem postImage={blog.fields.image} postName={blog.fields.title} />
      </div>
      {blog?.fields?.image ? (
        <Image
          src={blog.fields.image}
          width={850}
          height={450}
          alt={blog.fields.title}
          className={styles['image--main']}
          priority
        />
      ) : (
        <div className={styles['image--main--error']}>
          <p className={styles['image--main--error__text']}>Image failed to load</p>
        </div>
      )}
      <BlogDescription blog={blog} />
    </div>
  )
}

export default BlogDetail
