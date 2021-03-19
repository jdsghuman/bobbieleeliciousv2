import ReactMarkdown from 'react-markdown'
import AuthorItem from '../../../Author/AuthorItem'
import { BlogPropType } from '../../../PropTypes/PropTypes'
import PostTags from '../../../PostTags/PostTags'
import ShareIconItem from '../../../SocialMedia/ShareIcons/ShareIconItem'
import styles from './BlogDescription.module.scss'

const BlogDescription = ({ blog }: BlogPropType) => {
  return (
    <div className={styles.container}>
      <ReactMarkdown
        linkTarget="_blank"
        className={styles.markdown}
        source={blog.fields.description}
      />
      <div className={styles['container--blog--icons']}>
        <AuthorItem blog={blog} />
        <ShareIconItem postImage={blog.fields.image} postName={blog.fields.title} />
      </div>
      {blog?.fields?.tag && <PostTags tags={blog.fields.tag} />}
    </div>
  )
}

export default BlogDescription
