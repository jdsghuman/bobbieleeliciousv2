import classNames from 'classnames/bind'

import styles from './ProgressBar.module.scss'
const cx = classNames.bind(styles)

interface PropgressBarProps {
  progress: number
  location?: 'bottom' | 'top'
}

const ProgressBar = ({ progress, location }: PropgressBarProps) => {
  return (
    <div
      className={cx('container', {
        container__top: location === 'top',
        container__bottom: location === 'bottom',
      })}
    >
      <div className={styles.bar}>
        <div className={styles['bar--fill']} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

export default ProgressBar
