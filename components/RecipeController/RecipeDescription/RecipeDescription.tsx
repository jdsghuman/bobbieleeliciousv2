import styles from './RecipeDescription.module.scss'

const RecipeDescription = ({ post }) => {
  return <div className={styles.container}>{post.fields.description}</div>
}

export default RecipeDescription
