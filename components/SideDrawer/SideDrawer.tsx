import Link from '../Link/Link'
import classNames from 'classnames/bind'
import styles from './SideDrawer.module.scss'

const cx = classNames.bind(styles)

const SideDrawer = ({ click, show }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <nav
      onClick={click}
      className={cx('drawer', {
        'drawer--open': show,
      })}
    >
      <div onClick={click} className={styles.drawer__header}>
        <Link href="/">
          <img
            className={styles.drawer__image}
            alt="logo"
            src="/images/BobbieLeeLicious-logo-transparent.png"
          />
        </Link>
      </div>
      <div className={styles.drawer__item}>
        <Link href="/recipes">
          <a>Recipes</a>
        </Link>
      </div>
      <div className={styles.drawer__item}>
        <Link href="/blogs">
          <a>Blog</a>
        </Link>
      </div>
      <div className={styles.drawer__item}>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </nav>
  )
}

export default SideDrawer
