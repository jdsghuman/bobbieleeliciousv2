import Document, { Html, Head, Main, NextScript } from 'next/document'

type Props = {
  isProduction: boolean
}

class MyDocument extends Document<Props> {
  render() {
    const language = 'en'
    return (
      <Html lang={language}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
