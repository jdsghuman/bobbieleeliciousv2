import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import debounce from 'lodash.debounce'
import LinkDisplay from '../Link/LinkDisplay'
import Icon from '../Icon/Icon'
import DrawerToggleButton from '../SideDrawer/DrawerToggle'
import Filter from '../Filter'
import SearchContext from '../../store/search-context'
import FilterApplied from '../Filter/FilterApplied'

import styles from './Nav.module.scss'

const cx = classNames.bind(styles)

const Nav = ({ drawerToggleClickHandler, sideDrawerOpen }) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTopOfPage, setIsTopOfPage] = useState(true)
  const searchCtx = useContext(SearchContext)

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

  const toggleFilter = () => {
    setIsOpenFilter(!isOpenFilter)
  }

  useEffect(() => {
    const debounceNav = debounce(() => resizeHeaderOnScroll(), 100)

    window.addEventListener('scroll', debounceNav)
    return () => window.removeEventListener('scroll', debounceNav)
  }, [])

  useEffect(() => {
    searchCtx.clearFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <>
      <header
        className={cx('header', {
          'header--border':
            searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0,
        })}
      >
        <>
          <div className={styles['logo__container--desktop']}>
            <LinkDisplay link="/" onClick={goToHomePage}>
              <Image
                className={styles.image}
                src="/images/bobbieleelicious-logo-black.png"
                alt={'Logo'}
                width={200}
                height={100}
              />
            </LinkDisplay>
          </div>
          <div
            className={cx('header__container', {
              'header__container--filter':
                searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0,
            })}
          >
            {router.pathname === '/recipes' ||
            router.pathname === '/blogs' ||
            router.pathname === '/' ? (
              <div
                className={cx('nav__search__container', {
                  'nav__search__container__mobile--top': !isTopOfPage,
                })}
              >
                <Filter isOpen={isOpenFilter} closeFilter={toggleFilter} />
                <Icon
                  identifier="search"
                  viewBox="0 0 600 350"
                  fill={'#555'}
                  dimensions={{ height: 30, width: 26 }}
                  className={styles.nav__search__mobile}
                  click={toggleFilter}
                />
              </div>
            ) : (
              <div className={styles['nav__search__mobile--none']}></div>
            )}
            <div className={styles['logo__container--mobile']}>
              <LinkDisplay link="/" onClick={goToHomePage}>
                <Image
                  className={cx('logo__image', {
                    'logo__image--small': !isTopOfPage,
                  })}
                  src="/images/bobbieleelicious-logo-black.png"
                  alt={'Logo'}
                  width={200}
                  height={100}
                />
              </LinkDisplay>
            </div>
            <nav
              className={cx('nav__mobile', {
                'nav__mobile--small': !isTopOfPage,
              })}
            >
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
                  'nav__items--filter':
                    searchCtx.filter.searchTerm.length > 0 ||
                    searchCtx.filter.categories.length > 0,
                  'nav__items--hidden': !isExpanded,
                })}
              >
                <li className={styles['nav__items--home']}>
                  <LinkDisplay link="/" onClick={handleMobileMenu} style={styles.nav__link}>
                    Home
                  </LinkDisplay>
                </li>
                <li>
                  <LinkDisplay link="/recipes" onClick={handleMobileMenu} style={styles.nav__link}>
                    Recipes
                  </LinkDisplay>
                </li>
                <li>
                  <LinkDisplay link="/blogs" onClick={handleMobileMenu} style={styles.nav__link}>
                    Blog
                  </LinkDisplay>
                </li>
                <li>
                  <LinkDisplay link="/about" onClick={handleMobileMenu} style={styles.nav__link}>
                    About
                  </LinkDisplay>
                </li>
                {router.pathname === '/recipes' ||
                router.pathname === '/blogs' ||
                router.pathname === '/' ? (
                  <li>
                    <button className={styles.nav__btn} type="button" onClick={toggleFilter}>
                      <Icon
                        identifier="search"
                        viewBox="0 0 600 350"
                        fill={'#555'}
                        dimensions={{ height: 30, width: 26 }}
                        className={styles.nav__search}
                      />
                    </button>
                  </li>
                ) : (
                  <div className={styles['nav__search--none']}></div>
                )}
              </ul>
            </nav>
          </div>
        </>
        {(searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0) && (
          <FilterApplied />
        )}
      </header>
    </>
  )
}

export default Nav
