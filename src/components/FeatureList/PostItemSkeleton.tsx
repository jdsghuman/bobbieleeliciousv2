import styles from './FeatureList.module.scss'

const PostItemSkeleton = () => (
  <div className={styles['skeleton']}>
    <div className={styles['skeleton__image']} />
    <div className={styles['skeleton__title']} />
    <div className={styles['skeleton__line']} />
    <div className={styles['skeleton__line']} />
    <div className={styles['skeleton__line--short']} />
    <div className={styles['skeleton__footer']}>
      <div className={styles['skeleton__author']} />
      <div className={styles['skeleton__button']} />
    </div>
  </div>
)

export default PostItemSkeleton
