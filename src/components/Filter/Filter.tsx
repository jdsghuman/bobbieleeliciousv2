import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import classNames from 'classnames/bind'
import SearchContext from '../../store/search-context'
import Icon from '../Icon/Icon'
import Button from '../Button'
import styles from './Filter.module.scss'
const cx = classNames.bind(styles)

const Filter = ({ closeFilter, isOpen }) => {
  const searchCtx = useContext(SearchContext)
  const router = useRouter()

  const inputRef = useRef<any>(null)

  const clear = () => {
    searchCtx.filter.searchTerm === '' && closeFilter()
    searchCtx.clearFilter()
    router.replace({ pathname: router.pathname }, undefined, { shallow: true })
  }

  const updateSearch = (e) => {
    const value = e.target.value
    searchCtx.updateFilter('searchTerm', value)
    const existing = new URLSearchParams((router.asPath.split('?')[1] || '').split('#')[0])
    const newQuery: Record<string, string> = Object.fromEntries(existing.entries())
    if (value) {
      newQuery.q = value
    } else {
      delete newQuery.q
    }
    router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      closeFilter()
    }
  }

  const searchRecipes = () => {
    closeFilter()
  }

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus()
    }
  })

  return (
    <div
      className={cx('container', {
        'container--show': isOpen,
      })}
    >
      <button
        type="button"
        onClick={closeFilter}
        aria-label="Close search"
        className={styles.container__close}
      >
        <Icon identifier="close" viewBox="0 0 500 512" dimensions={{ height: 12, width: 12 }} />
      </button>
      <div className={styles.search__container}>
        <div className={styles.search}>
          <label htmlFor="search-input" className={styles['sr-only']}>
            Search
          </label>
          <input
            id="search-input"
            type="text"
            name="searchTerm"
            onChange={(e) => updateSearch(e)}
            onKeyDown={handleKeyDown}
            value={searchCtx.filter.searchTerm}
            ref={inputRef}
            className={styles.search__input}
            placeholder="Search..."
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
      <div className={styles.button__container}>
        <Button type="button" onClick={clear} accent>
          Clear
        </Button>
        <Button type="button" className={styles.button} onClick={searchRecipes} primary>
          Search
        </Button>
      </div>
    </div>
  )
}

export default Filter
