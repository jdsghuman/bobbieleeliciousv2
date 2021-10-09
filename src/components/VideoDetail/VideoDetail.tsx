import styles from './VideoDetail.module.scss'

const VideoDetail = ({ url }) => {
  const videoSrc = `https://www.youtube.com/embed/${url}`

  return (
    <div className={styles.video}>
      <iframe
        style={{
          width: '90%',
          height: '100%',
        }}
        title="video player"
        src={videoSrc}
      />
    </div>
  )
}

export default VideoDetail
