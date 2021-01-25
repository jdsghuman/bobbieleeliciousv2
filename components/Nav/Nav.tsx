import React, { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import Link from "../Link/Link";
import Icon from "../Icon/Icon";
import styles from "./Nav.module.scss";
import Button from "../Button/Button";

const cx = classNames.bind(styles);

const Nav = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMobileMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const goToHomePage = () => {
    router.pathname === "/" && window.location.reload();
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.logo__container}>
          <Link href="/">
            <a onClick={goToHomePage}>
              <img
                className={styles.logo__image}
                src="/images/bobbieleelicious-logo-black.png"
              />
            </a>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Button
            onClick={handleMobileMenu}
            type="button"
            primary
            className={styles.nav__button}
          >
            Menu
            <Icon
              identifier="chevron"
              viewBox="0 0 600 750"
              fill={"#555"}
              dimensions={{ height: 20, width: 20 }}
              className={cx("nav__chevron", {
                "nav__chevron--rotate": isExpanded,
              })}
            />
          </Button>
          <ul
            className={cx("nav__items", {
              "nav__items--hidden": !isExpanded,
            })}
          >
            <li className={styles["nav__items--home"]}>
              <Link href="/">
                <a onClick={handleMobileMenu} className={styles.nav__link}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/recipes">
                <a onClick={handleMobileMenu} className={styles.nav__link}>Recipes</a>
              </Link>
            </li>
            <li>
              <Link href="/blogs">
                <a onClick={handleMobileMenu} className={styles.nav__link}>Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a onClick={handleMobileMenu} className={styles.nav__link}>About</a>
              </Link>
            </li>
            {router.pathname !== "/about" && (
              <Icon
                identifier="search"
                viewBox="0 0 600 350"
                fill={"#555"}
                dimensions={{ height: 30, width: 26 }}
                className={styles.nav__search}
                // click={toggleFilter}
              />
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
