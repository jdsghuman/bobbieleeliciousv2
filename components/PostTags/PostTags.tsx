import styles from './PostTags.module.scss'
import { TagPropType } from '../PropTypes/PropTypes'

interface PostTagsPropType {
  tags: TagPropType[]
}
const PostTags = ({ tags }: PostTagsPropType) => {
  return (
    <div className={styles.container}>
      {tags?.map((tag, i) => {
        return (
          <p key={tag.sys.id + i} className={styles.tag}>
            #{tag.fields.name}
          </p>
        )
      })}
    </div>
  )
}

export default PostTags
