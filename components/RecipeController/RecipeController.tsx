import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import classNames from 'classnames/bind'
import smoothscroll from 'smoothscroll-polyfill'
import RecipeData from './RecipeData/RecipeData'

import styles from './RecipeController.module.scss'

const cx = classNames.bind(styles)

const RecipeController = ({ post }) => {
  const [isTop, setIsTop] = useState(true)

  const handleScroll = () => {
    document.getElementById('details__hr').scrollIntoView({
      behavior: 'smooth',
    })
  }

  const scrollUp = () => {
    window.scrollY > 75 ? setIsTop(false) : setIsTop(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    smoothscroll.polyfill()
    const checkScroll = debounce(() => scrollUp(), 100)
    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div
      className={cx('container', {
        'container--scrolled': !isTop,
      })}
    >
      <div onClick={handleScroll} id="details__hr" className={styles.details__hr} />
      <RecipeData
        cooktime={post.fields.cooktime}
        prep={post.fields.prep}
        servings={post.fields.servings}
      />
    </div>
  )
}

export default RecipeController
