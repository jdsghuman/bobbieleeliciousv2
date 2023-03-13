import styles from './Pagination.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PaginationPropType {
  active: boolean
  count: number
  setActiveImage: (count: number) => void
  activeNeighbor: boolean
}

const Pagination = ({ active, count, setActiveImage, activeNeighbor }: PaginationPropType) => {
  return (
    <li className={styles.pagination}>
      <button
        className={cx('pagination__circle', {
          'pagination__circle--active': active,
          'pagination__circle--active--neighbor': activeNeighbor,
        })}
        onClick={() => setActiveImage(count)}
      ></button>
    </li>
  )
}

export default Pagination
