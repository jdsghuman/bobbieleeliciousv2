import Link from 'next/link'
import { truncateText } from '../../Util/Util'
import styles from './CarouselItem.module.scss'

const CarouselItem = ({ imageDetails }) => (
  <div className={styles.item__container}>
    <div className={styles.item}>
      <h3 className={styles.item__title}>{imageDetails.label}</h3>
      <p className={styles.item__description}>{truncateText(imageDetails.description, 154)}</p>
      <Link href={`${imageDetails.type === 'recipe' ? '/recipe' : '/blog'}/${imageDetails.slug}`}>
        <a className={styles.item__button}>Read More</a>
      </Link>
    </div>
  </div>
)

export default CarouselItem
