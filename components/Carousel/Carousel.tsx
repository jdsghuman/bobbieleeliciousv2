import { useEffect, useState } from 'react'
import CarouselItem from './CarouselItem/CarouselItem'
import Pagination from './Pagination/Pagination'
import { useSwipeable } from 'react-swipeable'
import styles from './Carousel.module.scss'

interface Carousel {
  featuredPosts: Array<any>
}

const Carousel = ({ featuredPosts }: Carousel) => {
  const [currentInterval, setCurrentInterval] = useState(0)
  const [style, setStyle] = useState(styles.carousel__container)

  const images = featuredPosts.map((post, i) => {
    return {
      key: i,
      label: post.fields.title,
      path: post.fields.image,
      description: post.fields.description,
      slug: post.fields.slug,
      type: post.sys.contentType.sys.id,
    }
  })

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentInterval(currentInterval < featuredPosts.length - 1 ? currentInterval + 1 : 0),
    onSwipedRight: () =>
      setCurrentInterval(currentInterval > 0 ? currentInterval - 1 : featuredPosts.length - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStyle(styles['container--none'])

      setCurrentInterval(currentInterval < featuredPosts.length - 1 ? currentInterval + 1 : 0)
    }, 6000)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    setStyle(styles.carousel__container)
  }, [currentInterval])

  return (
    <>
      <div {...handlers} className={styles.carousel}>
        <div className={style}>
          <img
            className={styles.carousel__image}
            src={images[currentInterval].path}
            alt={images[currentInterval].label}
          />
        </div>
        <div className={styles.carousel__controls}>
          <CarouselItem imageDetails={images[currentInterval]} />
        </div>
      </div>
      <ul className={styles.carousel__pagination}>
        {images.map((image, i) => (
          <Pagination
            key={image.key}
            count={i}
            setActiveImage={setCurrentInterval}
            active={image.label === images[currentInterval].label}
          />
        ))}
      </ul>
    </>
  )
}

export default Carousel
