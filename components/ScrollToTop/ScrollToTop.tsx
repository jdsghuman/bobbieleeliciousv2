import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import Icon from '../Icon/Icon'
import smoothscroll from 'smoothscroll-polyfill'
import styles from './ScrollToTop.module.scss'

const cx = classNames.bind(styles)

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = useState(false)
  smoothscroll.polyfill()

  const checkScrollTop = useCallback(() => {
    const navHeight = 800

    if (!showScroll && window.pageYOffset > navHeight) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= navHeight) {
      setShowScroll(false)
    }
  }, [showScroll])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [checkScrollTop])

  return (
    <div>
      <Icon
        identifier="arrowup"
        viewBox="2 0 18 22"
        fill={'#888'}
        dimensions={{ height: 44, width: 30 }}
        className={cx('icon', {
          'icon--hide': !showScroll,
        })}
        click={scrollTop}
      />
    </div>
  )
}

export default ScrollToTop
