import styles from './Signature.module.scss'

interface SignaturePropType {
  author: string
}

const Signature = ({ author }: SignaturePropType) => {
  return (
    <div className={styles.container}>
      <p className={styles.xo}>XO,</p>
      <p className={styles.signature}>{author}</p>
    </div>
  )
}

export default Signature
