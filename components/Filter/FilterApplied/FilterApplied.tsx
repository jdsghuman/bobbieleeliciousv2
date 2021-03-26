import React, { useContext } from 'react'
import classNames from 'classnames/bind'
import SearchContext from '../../../store/search-context'

import styles from './FilterApplied.module.scss'

const cx = classNames.bind(styles)

const FilterApplied = () => {
  const searchCtx = useContext(SearchContext)

  return (
    <div
      className={cx('filter--show', {
        'filter--hide': searchCtx.filter.searchTerm.length === 0,
      })}
      onClick={searchCtx.clearFilter}
    >
      Filter applied - tap to clear
    </div>
  )
}

export default FilterApplied
