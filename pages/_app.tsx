import React, { Fragment } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import '../styles/main.scss'
import Layout from '../components/Layout/Layout'
import { defaultMetaTags } from '../components/Util/Constants'
import { trackPageView, GA_TRACKING_ID } from '../components/PropTypes/GTags'

Router.events.on('routeChangeComplete', (url) => trackPageView(url))

export const getStaticProps = async () => {
  const isProduction = process.env.NODE_ENV.toLowerCase() === 'production'
  // const initialProps = await Document.getStaticProps(context)
  return {
    props: {
      isProduction,
    },
  }
}

function MyApp({ Component, pageProps, isProduction }) {
  const setGoogleTags = (GA_TRACKING_ID) => {
    return {
      __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
            `,
    }
  }
  return (
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
        {/* Global Site Tag (gtag.js) -- Google Analytics -- Check if isProduction */}
        {isProduction && (
          <Fragment>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
            {/* Call the function above to inject the contents of the script tag */}
            <script dangerouslySetInnerHTML={setGoogleTags(GA_TRACKING_ID)} />
          </Fragment>
        )}
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
