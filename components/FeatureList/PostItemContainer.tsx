import styles from './FeatureList.module.scss'

const PostItemContainer = ({ children, title }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.items}>{children}</div>
    </div>
  )
}

export default PostItemContainer
