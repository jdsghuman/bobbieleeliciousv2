import { DiscussionEmbed } from 'disqus-react'
import { BlogsPropType, RecipesPropType } from '../PropTypes/PropTypes'
import styles from './DisqusComments.module.scss'

interface DisqusCommentsPropType {
  post: BlogsPropType | RecipesPropType
}
const DisqusComments = ({ post }: DisqusCommentsPropType) => {
  const disqusShortname = 'bobbieleelicious'

  const postType = post.sys.contentType.sys.id === 'recipe' ? 'recipe' : 'blog'

  const disqusConfig = {
    url: `https://bobbieleelicious.com/${postType}/${post.fields.slug}`,
    identifier: post.sys.id,
    title: post.fields.title,
  }
  return (
    <div className={styles.container}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}
export default DisqusComments
