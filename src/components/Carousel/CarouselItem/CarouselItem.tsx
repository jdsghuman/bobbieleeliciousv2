import Link from 'next/link'
import { truncateText } from '../../Util/Util'
import Icon from '../../Icon/Icon'
import styles from './CarouselItem.module.scss'

interface CarouselItemPropType {
  imageDetails: {
    label: string
    description: string
    slug: string
    type: string
  }
  readMoreRef: any
}

const CarouselItem = ({ imageDetails, readMoreRef }: CarouselItemPropType) => (
  <div className={styles.item__container}>
    <div className={styles.item}>
      <h1 className={styles.item__title}>{imageDetails.label}</h1>
      <p className={styles.item__description}>{truncateText(imageDetails.description, 154)}</p>
      <Link
        href={`${imageDetails.type === 'recipe' ? '/recipe' : '/blog'}/${imageDetails.slug}`}
        ref={readMoreRef}
        className={styles.item__button}
        passHref
      >
        Read More <span className={styles.item__button__sr}>about {imageDetails.label}</span>
        <Icon
          identifier="arrowright"
          viewBox="0 0 24 24"
          dimensions={{ height: 24, width: 24 }}
          fill={'#cebf37'}
          className={styles.icon__right}
        />{' '}
      </Link>
    </div>
  </div>
)

CarouselItem.displayName = 'CarouselItem'

export default CarouselItem
