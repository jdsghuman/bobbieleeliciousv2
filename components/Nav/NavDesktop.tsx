// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { connect, useDispatch } from 'react-redux';
// import { SHOW_SUBSCRIBE, HIDE_SUBSCRIBE } from '../actionTypes';
// import ModalDisplay from '../Shared/ModalDisplay/ModalDisplay';
// import Subscribe from '../Subscribe/Subscribe';

import Link from "../Link/Link";
import styles from "./NavDesktop.module.scss";

const NavbarDesktop = () => {
  //   const dispatch = useDispatch();

  //   const closeModal = () => {
  //     dispatch({ type: HIDE_SUBSCRIBE })
  //   }

  return (
    <>
      {/* <Link
        className={styles.nav__link}
        activeClassName={styles['nav__link--active']}
        href="/">
        <a>Home</a>
      </Link>
      <Link
        // className={styles.nav__link}
        // activeClassName={styles['nav__link--active']}
        href="/recipes">
        <a>Recipes</a>
      </Link>
      <Link
        // className={styles.nav__link}
        // activeClassName={styles['nav__link--active']}
        href="/blogs">
        <a>Blogs</a>
      </Link>
      <Link
        // className={styles.nav__link}
        // activeClassName={styles['nav__link--active']}
        href="/about">
        <a>About</a>
   </Link> */}
      <Link href="/">
        <a className={styles.nav__link}>Home</a>
      </Link>
      <Link href="/recipes">
        <a className={styles.nav__link}>Recipes</a>
      </Link>
      <Link href="/blogs">
        <a className={styles.nav__link}>Blog</a>
      </Link>
      <Link href="/about">
        <a className={styles.nav__link}>About</a>
      </Link>
      <p
        // onClick={() => dispatch({ type: SHOW_SUBSCRIBE })}
        className={styles.nav__link}
      >
        Subscribe
      </p>
      {/* <ModalDisplay
        isOpen={showSubscribe.show}
        closeModal={closeModal}
      >
        <Subscribe />
      </ModalDisplay> */}
    </>
  );
};

// const mapStateToProps = state => ({
//   showSubscribe: state.showSubscribe
// });

export default NavbarDesktop;
