import ShareIconItem from './ShareIconItem'
import styles from './ShareIcons.module.scss'

interface ShareIconsProps {
  postImage: string
  postName: string
  iconRef: any
}
const ShareIcons = ({ postImage, postName, iconRef }: ShareIconsProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Share the love</h3>
      <ShareIconItem iconRef={iconRef} postName={postName} postImage={postImage} />
    </div>
  )
}

export default ShareIcons
