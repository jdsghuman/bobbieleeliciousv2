import Head from 'next/head'
import styles from '../styles/Home.module.css'

let client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN
})

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: 'recipe'
  })
  return {
    props: {
      recipes: data.items
    }
  }
}

export default function Home({ recipes }) {
  console.log('recipes', recipes)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Bobbieleelicious</div>
    </div>
  )
}
