import styles from './RecipeTags.module.scss'
import { TagPropType } from '../../PropTypes/PropTypes'

interface RecipeTagsPropType {
  tags: TagPropType[]
}
const RecipeTags = ({ tags }: RecipeTagsPropType) => {
  return (
    <div className={styles.container}>
      {tags?.map((tag) => {
        return (
          <p key={tag.sys.id} className={styles.tag}>
            #{tag.fields.name}
          </p>
        )
      })}
    </div>
  )
}

export default RecipeTags
