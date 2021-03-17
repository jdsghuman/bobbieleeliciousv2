import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import debounce from 'lodash.debounce'
import LinkDisplay from '../Link/LinkDisplay'
import Icon from '../Icon/Icon'
import styles from './Nav.module.scss'
import DrawerToggleButton from '../SideDrawer/DrawerToggle/DrawerToggleButton'

const cx = classNames.bind(styles)

const Nav = ({ drawerToggleClickHandler, sideDrawerOpen }) => {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTopOfPage, setIsTopOfPage] = useState(true)

  const resizeHeaderOnScroll = () => {
    const distanceY = window.pageYOffset || document.documentElement.scrollTop
    if (distanceY > 200) {
      setIsTopOfPage(false)
    } else if (distanceY < 50) {
      setIsTopOfPage(true)
    }
  }

  const handleMobileMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const goToHomePage = () => {
    router.pathname === '/' && window.location.reload()
  }

  useEffect(() => {
    const debounceNav = debounce(() => resizeHeaderOnScroll(), 100)

    window.addEventListener('scroll', debounceNav)
    return () => window.removeEventListener('scroll', debounceNav)
  }, [])

  return (
    <header
      className={cx('header', {
        'header--small': !isTopOfPage,
      })}
    >
      <div
        className={cx('header__container', {
          'header__container--small': !isTopOfPage,
        })}
      >
        {router.pathname !== '/about' && (
          <div className={styles.nav__search__container}>
            {/* <Filter
              isOpen={isOpenFilter}
              closeFilter={toggleFilter}
            /> */}
            <Icon
              identifier="search"
              viewBox="0 0 600 350"
              fill={'#555'}
              dimensions={{ height: 30, width: 26 }}
              className={styles.nav__search__mobile}
              // click={toggleFilter}
            />
          </div>
        )}
        <div className={styles.logo__container}>
          <LinkDisplay link="/">
            <a onClick={goToHomePage}>
              <img
                className={cx('logo__image', {
                  'logo__image--small': !isTopOfPage,
                })}
                src="/images/bobbieleelicious-logo-black.png"
                alt={'Logo'}
              />
            </a>
          </LinkDisplay>
        </div>
        <nav className={styles.nav__mobile}>
          {/* Hamburger menu for tablet/mobile */}
          <DrawerToggleButton show={sideDrawerOpen} click={drawerToggleClickHandler} />
        </nav>
        <nav
          className={cx('nav', {
            'nav--small': !isTopOfPage,
            'nav__border--unset': !isTopOfPage,
          })}
        >
          <ul
            className={cx('nav__items', {
              'nav__items--hidden': !isExpanded,
            })}
          >
            <li className={styles['nav__items--home']}>
              <LinkDisplay link="/">
                <a onClick={handleMobileMenu} className={styles.nav__link}>
                  Home
                </a>
              </LinkDisplay>
            </li>
            <li>
              <LinkDisplay link="/recipes">
                <a onClick={handleMobileMenu} className={styles.nav__link}>
                  Recipes
                </a>
              </LinkDisplay>
            </li>
            <li>
              <LinkDisplay link="/blogs">
                <a onClick={handleMobileMenu} className={styles.nav__link}>
                  Blog
                </a>
              </LinkDisplay>
            </li>
            <li>
              <LinkDisplay link="/about">
                <a onClick={handleMobileMenu} className={styles.nav__link}>
                  About
                </a>
              </LinkDisplay>
            </li>
            {router.pathname !== '/about' && (
              <Icon
                identifier="search"
                viewBox="0 0 600 350"
                fill={'#555'}
                dimensions={{ height: 30, width: 26 }}
                className={styles.nav__search}
                // click={toggleFilter}
              />
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Nav
