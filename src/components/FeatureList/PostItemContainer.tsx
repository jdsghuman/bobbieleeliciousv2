import classNames from 'classnames/bind'
import styles from './FeatureList.module.scss'

const cx = classNames.bind(styles)

const PostItemContainer = ({ children, title }) => {
  return (
    <div className={styles.container}>
      <h3 className={cx('title', 'unselectable')}>{title}</h3>
      <div className={styles.items}>{children}</div>
    </div>
  )
}

export default PostItemContainer
