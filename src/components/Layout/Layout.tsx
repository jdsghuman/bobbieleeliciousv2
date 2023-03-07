import { useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Nav from '../Nav'
import Footer from '../Footer'
import Backdrop from '../Backdrop'
import SideDrawer from '../SideDrawer/SideDrawer'
import { MetaTags } from '../PropTypes/Tags'
import Meta from '../Meta'

interface Props {
  metaTags: MetaTags
  children: ReactNode
}

const Layout = ({ children, metaTags }: Props) => {
  const router = useRouter()
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false)

  const backdropClickHandler = () => {
    setSideDrawerOpen(false)
  }

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen)
  }

  const getBackdrop = () => sideDrawerOpen && <Backdrop click={backdropClickHandler} />

  if (router.pathname.endsWith('/print')) {
    return <>{children}</>
  }

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
