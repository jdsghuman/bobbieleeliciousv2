import classNames from 'classnames/bind'
import styles from './DrawerToggleButton.module.scss'

const cx = classNames.bind(styles)

const DrawerToggleButton = ({ click, show }) => (
  <button
    type="button"
    className={styles.toggle}
    onClick={click}
    aria-label={show ? 'Close menu' : 'Open menu'}
    aria-expanded={show}
  >
    <div id={styles.nav__icon} className={cx({ open: show })}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>
)

export default DrawerToggleButton
