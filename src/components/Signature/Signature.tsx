import className from 'classnames/bind'
import styles from './Signature.module.scss'

const cx = className.bind(styles)

interface SignaturePropType {
  author: string
  location?: string
}

const Signature = ({ author, location }: SignaturePropType) => {
  return (
    <div
      className={cx('container', {
        container__about: location === 'about',
      })}
    >
      <p className={styles.xo}>XO,</p>
      <p className={styles.signature}>{author}</p>
    </div>
  )
}

export default Signature
