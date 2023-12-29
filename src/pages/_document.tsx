import Document, { Html, Head, Main, NextScript } from 'next/document'

const isProduction = process.env.NODE_ENV === 'production'

class MyDocument extends Document {
  render() {
    const language = 'en'
    return (
      <Html lang={language}>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {isProduction && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_TRACKING_ID}');
          `,
                }}
              />
            </>
          )}
          <script
            async
            defer
            crossOrigin="anonymous"
            src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v10.0&appId=${process.env.FACEBOOK_APP_ID}&autoLogAppEvents=1`}
            nonce="PudrHDZ4"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal"></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument
