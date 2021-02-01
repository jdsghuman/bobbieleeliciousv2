import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { HomePropType } from "../components/PropTypes/PropTypes";
import { getAllPosts } from "../lib/index";

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await getAllPosts();
  return {
    props: {
      blogs: posts.blogs,
      recipes: posts.recipes,
    },
    revalidate: 60,
  };
};

const Home = ({ blogs, recipes }: HomePropType) => {
  console.log("recipes----", recipes);
  console.log("blogs----", blogs);
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
};

export default Home;
