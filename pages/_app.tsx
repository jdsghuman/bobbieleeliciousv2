import Head from 'next/head'
import Router from 'next/router'
import '../styles/main.scss'
import Layout from '../components/Layout/Layout'
import { defaultMetaTags } from '../components/Util/Constants'
import { trackPageView } from '../components/PropTypes/GTags'

Router.events.on('routeChangeComplete', (url) => trackPageView(url))

function MyApp({ Component, pageProps }) {
  return (
    <Layout metaTags={defaultMetaTags}>
      <Head>
        <title>Bobbieleelicous</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
