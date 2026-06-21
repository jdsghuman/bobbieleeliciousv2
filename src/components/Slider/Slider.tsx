import { useEffect, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import SearchContext from '../../store/search-context'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import smoothscroll from 'smoothscroll-polyfill'
import styles from './Slider.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface SliderPropType {
  items: any
}

const Slider = ({ items }: SliderPropType) => {
  const searchCtx = useContext(SearchContext)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (scrollOffset) => {
    if (ref?.current) {
      ref.current.scrollLeft += scrollOffset
    }
  }

  const toggleSliderOption = (name) => {
    const existing = new URLSearchParams((router.asPath.split('?')[1] || '').split('#')[0])
    if ((existing.get('category') || '') === name) return
    searchCtx.updateFilter('categories', name)
    const newQuery: Record<string, string> = Object.fromEntries(existing.entries())
    newQuery.category = name
    router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }

  useEffect(() => {
    smoothscroll.polyfill()
  }, [])

  if (!items?.data?.length) return null

  return (
    <div className={styles.container__slider}>
      <button
        type="button"
        onClick={() => scroll(-60)}
        aria-label="Scroll categories left"
        className={styles.arrow}
      >
        <Icon
          identifier="chevronBack"
          viewBox="0 0 512 512"
          fill="none"
          stroke="#888888"
          strokeWidth="22"
        />
      </button>
      <div ref={ref} className={styles.container}>
        {items.data
          .sort((a, b) => {
            return a.fields.name.toLowerCase() > b.fields.name.toLowerCase() ? 1 : -1
          })
          .map((item) => {
            return (
              <button
                key={item.sys.id}
                onClick={() => toggleSliderOption(item.fields.name)}
                aria-pressed={searchCtx.filter.categories.includes(item.fields.name)}
                className={cx('item', {
                  'item-clicked': searchCtx.filter.categories.includes(item.fields.name),
                })}
                type="button"
              >
                <p
                  className={cx('item-title', 'unselectable', {
                    'item-title-clicked': searchCtx.filter.categories.includes(item.fields.name),
                  })}
                >
                  {item.fields.name}
                </p>
              </button>
            )
          })}
      </div>
      <button
        type="button"
        onClick={() => scroll(60)}
        aria-label="Scroll categories right"
        className={styles.arrow}
      >
        <Icon
          identifier="chevronForward"
          viewBox="0 0 512 512"
          fill="none"
          stroke="#888888"
          strokeWidth="15"
        />
      </button>
    </div>
  )
}

Slider.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
}

export default Slider
