import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import NavDesktop from './NavDesktop';
import './Nav.css';
import { resizeHeaderOnScroll } from '../Shared/Utilities/Utilities'
import SocialMediaIcons from '../SocialMediaIcons/SocialMediaIcons';
import Icon from '../Shared/Icon/Icon';
import Filter from '../Filter/Filter';
import ProfileIcon from '../Shared/Icon/ProfileIcon';
import ProfileDisplay from '../ProfileDisplay/ProfileDisplay';

const Nav = ({ activate, activateBanner, drawerToggleClickHandler, show, user }) => {
  let location = useLocation();
  const [clicked, setClicked] = useState(true);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isOpenProfileDisplay, setIsOpenProfileDisplay] = useState(false);

  const toggleFilter = () => {
    setIsOpenFilter(!isOpenFilter)
    setIsOpenProfileDisplay(false);
  }

  const closeProfileDisplay = () => {
    setIsOpenProfileDisplay(false);
  }
  const toggleProfileDisplay = () => {
    setIsOpenProfileDisplay(!isOpenProfileDisplay);
    setIsOpenFilter(false);
  }

  useEffect(() => {
    window.addEventListener("scroll", resizeHeaderOnScroll);
    return () => window.removeEventListener("scroll", resizeHeaderOnScroll);
  }, []);

  return (
    <div className="nav">
      <div className={`${activateBanner && user.id ? 'banner__logged-in' : 'banner__logged-out'}`}>
        Logged in!
      </div>
      <div className="nav__top">
        <ProfileIcon click={toggleProfileDisplay} fill={"#ddd9d9"} styles={"profile-icon"} viewBox={"0 0 512 512"} />
        <ProfileDisplay activate={activate} closeProfile={closeProfileDisplay} isOpen={isOpenProfileDisplay} />
        <div onClick={() => setClicked(!clicked)} className="nav-left">
          <Link to="/">
            <img className="image__logo--nav" alt="logo" src="/images/BobbieLeeLicious-logo-black.png" />
          </Link>
        </div>
        <div className="nav-right">
          <div className="menu--mobile">
            {/* Hamburger menu for tablet/mobile */}
            <DrawerToggleButton show={show} click={drawerToggleClickHandler} />
          </div>
          <div className="menu--desktop">
            <NavDesktop />
          </div>
        </div>
        {location.pathname === '/' &&
          <div
            className="menu--filter"
          >
            <Filter
              isOpen={isOpenFilter}
              closeFilter={toggleFilter}
            />
            <Icon
              identifier="search"
              viewBox="0 0 600 350"
              fill={'#555'}
              dimensions={{ height: 30, width: 26 }}
              className={'icon-search'}
              click={toggleFilter}
            />
          </div>
        }
        <div className="menu--desktop">
          <div className="nav-social">
            <SocialMediaIcons position="navbar" />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
