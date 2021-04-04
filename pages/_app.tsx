import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import '../styles/main.scss'
import Layout from '../components/Layout/Layout'
import { defaultMetaTags } from '../components/Util/Constants'
import * as gtag from '../lib/gtag'
import { SearchContextProvider } from '../store/search-context'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <SearchContextProvider>
      <Layout metaTags={defaultMetaTags}>
        <Head>
          {/*Global meta tags*/}
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <base href="/" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e9cec2" />
          <meta name="msapplication-TileColor" content="#e9cec2" />
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SearchContextProvider>
  )
}

export default MyApp
