import Head from 'next/head'
import '../styles/main.scss'
import Layout from '../components/Layout/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Bobbieleelicous</title>
        <meta name="keywords" content="Healthy cooking, vegetarian" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
