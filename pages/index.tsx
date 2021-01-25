import Head from "next/head"
import Link from "next/link"
import styles from "../styles/Home.module.css"
import { HomePropType } from './PropTypes'

let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

export async function getStaticProps() {
  let blogs = await client
    .getEntries({
      content_type: "blogPost",
    })
    .then((response) => response.items);

  let recipes = await client
    .getEntries({
      content_type: "recipe",
    })
    .then((response) => response.items);

  return {
    props: {
      blogs,
      recipes,
    },
    revalidate: 60,
  };
}

const Home: React.FC<HomePropType> = ({ blogs, recipes }) => {
  console.log('recipes----', recipes)
  console.log('blogs----', blogs)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Bobbieleelicious</div>
      <h3>Recipes</h3>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.sys.id}>
            <Link href={"/recipes/" + recipe.fields.slug}>
              <a>{recipe.fields.recipeTitle}</a>
            </Link>
          </li>
        ))}
      </ul>
      Blog
      <ul>
        {blogs.map((blog) => (
          <li key={blog.sys.id}>
            <Link href={"/blogs/" + blog.fields.slug}>
              <a>{blog.fields.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home
