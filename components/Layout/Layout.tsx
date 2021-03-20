import { useState, ReactNode } from 'react'
import Nav from '../Nav/Nav'
import Footer from '../Footer/Footer'
import Backdrop from '../Backdrop/Backdrop'
import SideDrawer from '../SideDrawer/SideDrawer'
import { MetaTags } from '../PropTypes/Tags'
import Meta from '../Meta'

interface Props {
  metaTags: MetaTags
  children: ReactNode
}

const Layout = ({ children, metaTags }: Props) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false)

  const backdropClickHandler = () => {
    setSideDrawerOpen(false)
  }

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen)
  }

  const getBackdrop = () => sideDrawerOpen && <Backdrop click={backdropClickHandler} />

  return (
    <>
      <Meta tags={metaTags} />
      <Nav drawerToggleClickHandler={drawerToggleClickHandler} sideDrawerOpen={sideDrawerOpen} />
      <SideDrawer show={sideDrawerOpen} click={backdropClickHandler} />
      {getBackdrop()}
      {children}
      <Footer />
    </>
  )
}

export default Layout
