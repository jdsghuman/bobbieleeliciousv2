import styles from './Pagination.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const Pagination = ({ active, count, setActiveImage }) => {
  return (
    <li className={styles.pagination}>
      <div
        className={cx('pagination__circle', {
          'pagination__circle--active': active,
        })}
        onClick={() => setActiveImage(count)}
      ></div>
    </li>
  )
}

export default Pagination
