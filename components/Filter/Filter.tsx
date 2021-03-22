import classNames from 'classnames/bind'
import styles from './Filter.module.scss'
const cx = classNames.bind(styles)

const Filter = ({ closeFilter, isOpen }) => {
  return (
    <div
      className={cx('container', {
        'container--show': isOpen,
      })}
    >
      Filter
    </div>
  )
}

export default Filter
