import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

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
  };
}

export default function Home({ blogs, recipes }) {
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
            <Link href={"/recipe/" + recipe.fields.slug}>
              <a>{recipe.fields.recipeTitle}</a>
            </Link>
          </li>
        ))}
      </ul>
      Blog
      <ul>
        {blogs.map((recipe) => (
          <li key={recipe.sys.id}>
            <Link href={"/recipe/" + recipe.fields.slug}>
              <a>{recipe.fields.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
