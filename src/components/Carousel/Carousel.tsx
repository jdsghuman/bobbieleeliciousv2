import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import CarouselItem from './CarouselItem'
import Pagination from './Pagination'
import { useSwipeable } from 'react-swipeable'
import styles from './Carousel.module.scss'
import React from 'react'

interface Carousel {
  featuredPosts: Array<any>
}

const CarouselContainer = React.forwardRef(({ featuredPosts }: Carousel) => {
  const readMoreButton = useRef<HTMLButtonElement>(null)
  const [currentInterval, setCurrentInterval] = useState(0)

  const images = featuredPosts.map((post, i) => {
    return {
      key: i,
      label: post.fields.title,
      path: post.fields.image,
      description: post.fields.description,
      slug: post.fields.slug,
      type: post.type,
    }
  })

  const setFocus = (i: number) => {
    if (readMoreButton.current !== null) {
      readMoreButton.current.focus()
    }
    setCurrentInterval(i)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentInterval((prev) => (prev < featuredPosts.length - 1 ? prev + 1 : 0)),
    onSwipedRight: () =>
      setCurrentInterval((prev) => (prev > 0 ? prev - 1 : featuredPosts.length - 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInterval((prev) => (prev < featuredPosts.length - 1 ? prev + 1 : 0))
    }, 6000)
    return () => clearInterval(interval)
  }, [featuredPosts.length])

  return (
    <>
      <div {...handlers} className={styles.carousel}>
        {images.map((image, i) => (
          <div
            key={image.key}
            className={`${styles.carousel__container} ${
              i === currentInterval ? styles['carousel__container--active'] : ''
            }`}
          >
            <Image
              className={styles.carousel__image}
              src={image.path}
              alt={image.label || 'carousel image'}
              width={1000}
              height={600}
              priority={i === 0}
            />
          </div>
        ))}
        <div key={currentInterval} className={styles.carousel__controls}>
          <CarouselItem imageDetails={images[currentInterval]} readMoreRef={readMoreButton} />
        </div>
      </div>
      <ul className={styles.carousel__pagination}>
        {images.map((image, i) => (
          <Pagination
            key={image.key}
            count={i}
            setActiveImage={setFocus}
            active={image.label === images[currentInterval].label}
            activeNeighbor={i === currentInterval + 1 || i === currentInterval - 1 ? true : false}
          />
        ))}
      </ul>
    </>
  )
})

CarouselContainer.displayName = 'CarouselContainer'

export default CarouselContainer
