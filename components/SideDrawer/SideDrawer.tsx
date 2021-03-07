import LinkDisplay from '../Link/LinkDisplay'
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
        <LinkDisplay link="/">
          <img
            className={styles.drawer__image}
            alt="logo"
            src="/images/BobbieLeeLicious-logo-transparent.png"
          />
        </LinkDisplay>
      </div>
      <div className={styles.drawer__item}>
        <LinkDisplay link="/recipes">
          <a>Recipes</a>
        </LinkDisplay>
      </div>
      <div className={styles.drawer__item}>
        <LinkDisplay link="/blogs">
          <a>Blog</a>
        </LinkDisplay>
      </div>
      <div className={styles.drawer__item}>
        <LinkDisplay link="/about">
          <a>About</a>
        </LinkDisplay>
      </div>
    </nav>
  )
}

export default SideDrawer
