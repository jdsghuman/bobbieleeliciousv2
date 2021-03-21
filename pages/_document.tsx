import React, { Fragment } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../components/PropTypes/GTags'

type Props = {
  isProduction: boolean
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const isProduction = process.env.NODE_ENV.toLowerCase() === 'production'
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps, isProduction }
  }

  setGoogleTags(GA_TRACKING_ID) {
    return {
      __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
            `,
    }
  }
  render() {
    const language = 'en'
    const { isProduction } = this.props
    return (
      <Html lang={language}>
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
              <script dangerouslySetInnerHTML={this.setGoogleTags(GA_TRACKING_ID)} />
            </Fragment>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
