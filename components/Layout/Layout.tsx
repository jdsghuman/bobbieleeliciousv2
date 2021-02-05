import { useState } from "react";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Backdrop from "../Backdrop/Backdrop";
import SideDrawer from '../SideDrawer/SideDrawer'

const Layout = ({ children }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const backdropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const getBackdrop = () =>
    sideDrawerOpen && <Backdrop click={backdropClickHandler} />;

  return (
    <>
      <Nav
        drawerToggleClickHandler={drawerToggleClickHandler}
        sideDrawerOpen={sideDrawerOpen}  
      />
      <SideDrawer
        show={sideDrawerOpen} 
        click={backdropClickHandler} 
      />
      {getBackdrop()}
      {children}
      <Footer />
    </>
  );
};

export default Layout;
