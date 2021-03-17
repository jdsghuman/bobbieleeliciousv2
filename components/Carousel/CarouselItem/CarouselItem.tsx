import Link from 'next/link'
import { truncateText } from '../../Util/Util'
import Icon from '../../Icon/Icon'
import styles from './CarouselItem.module.scss'

const CarouselItem = ({ imageDetails }) => (
  <div className={styles.item__container}>
    <div className={styles.item}>
      <h3 className={styles.item__title}>{imageDetails.label}</h3>
      <p className={styles.item__description}>{truncateText(imageDetails.description, 154)}</p>
      <Link href={`${imageDetails.type === 'recipe' ? '/recipe' : '/blog'}/${imageDetails.slug}`}>
        <a className={styles.item__button}>
          Read More{' '}
          <Icon
            identifier="arrowright"
            viewBox="0 0 24 24"
            dimensions={{ height: 24, width: 24 }}
            fill={'#cebf37'}
            className={styles.icon__right}
          />{' '}
        </a>
      </Link>
    </div>
  </div>
)

export default CarouselItem
