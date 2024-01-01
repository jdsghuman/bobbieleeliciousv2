import Image from 'next/image'
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
          <Image
            className={styles.drawer__image}
            alt="logo"
            src="/images/BobbieLeeLicious-logo-transparent.png"
            width={200}
            height={80}
          />
        </LinkDisplay>
      </div>
      <div
        className={cx('drawer__item', {
          'drawer__item--hide': !show,
        })}
      >
        <LinkDisplay link="/">Home</LinkDisplay>
      </div>
      <div
        className={cx('drawer__item', {
          'drawer__item--hide': !show,
        })}
      >
        <LinkDisplay link="/recipes">Recipes</LinkDisplay>
      </div>
      <div
        className={cx('drawer__item', {
          'drawer__item--hide': !show,
        })}
      >
        <LinkDisplay link="/blogs">Blog</LinkDisplay>
      </div>
      <div
        className={cx('drawer__item', {
          'drawer__item--hide': !show,
        })}
      >
        <LinkDisplay link="/about">About</LinkDisplay>
      </div>
    </nav>
  )
}

export default SideDrawer
