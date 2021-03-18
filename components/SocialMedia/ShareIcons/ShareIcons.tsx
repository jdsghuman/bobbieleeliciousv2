import ShareIconItem from './ShareIconItem'
import styles from './ShareIcons.module.scss'

const ShareIcons = ({ postImage, postName }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Share the love</h3>
      <ShareIconItem postName={postName} postImage={postImage} />
    </div>
  )
}

export default ShareIcons
