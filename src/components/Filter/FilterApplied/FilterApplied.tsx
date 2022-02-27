import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import SearchContext from '../../../store/search-context'

import styles from './FilterApplied.module.scss'

const cx = classNames.bind(styles)

const FilterApplied = () => {
  const searchCtx = useContext(SearchContext)
  const router = useRouter()

  const getFilterCount = () => {
    let sum = 0
    for (const flag of Object.values(searchCtx.filter)) {
      if (flag.length > 0) {
        ++sum
      }
    }
    return sum
  }

  return (
    <div
      className={cx('filter--show', {
        'filter--hide':
          (searchCtx.filter.searchTerm.length === 0 && searchCtx.filter.categories.length === 0) ||
          (router.pathname !== '/recipes' &&
            router.pathname !== '/blogs' &&
            router.pathname !== '/'),
      })}
      onClick={searchCtx.clearFilter}
    >
      <button className={styles.btn}>Filter applied - tap to clear ({getFilterCount()})</button>
    </div>
  )
}

export default FilterApplied
