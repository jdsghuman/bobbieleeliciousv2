import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import classNames from 'classnames/bind'
import SearchContext from '../../store/search-context'
import Icon from '../Icon/Icon'
import styles from './Filter.module.scss'
const cx = classNames.bind(styles)

const Filter = ({ closeFilter, isOpen }) => {
  const searchCtx = useContext(SearchContext)
  const router = useRouter()

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  })

  useEffect(() => {
    searchCtx.clearFilter()
  }, [router.asPath])

  return (
    <div
      className={cx('container', {
        'container--show': isOpen,
      })}
    >
      <Icon
        identifier="close"
        viewBox="0 0 500 512"
        dimensions={{ height: 18, width: 18 }}
        className={styles.container__close}
        click={closeFilter}
      />
      <div className={styles.search__container}>
        <div className={styles.search}>
          <input
            type="text"
            name="searchTerm"
            onChange={(e) => searchCtx.updateFilter(e)}
            value={searchCtx.filter.searchTerm}
            ref={inputRef}
            className={styles.search__input}
          />
        </div>
        <Icon
          identifier="search"
          viewBox="0 0 600 250"
          fill={'#555'}
          dimensions={{ height: 30, width: 26 }}
          className={styles.search__icon}
        />
      </div>
    </div>
  )
}

export default Filter
