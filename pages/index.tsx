import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { HomePropType } from '../components/PropTypes/PropTypes'
import { getAllPosts } from '../lib/index'
import Carousel from '../components/Carousel/Carousel'
import Subscribe from '../components/Subscribe/Banner'
import FeatureList from '../components/FeatureList/FeatureList'
import Spinner from '../components/Spinner/Spinner'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts()
  const featuredBlogs = posts.blogs.filter((blog) => blog.fields.featured)
  const featuredRecipes = posts.recipes.filter((recipe) => recipe.fields.featured)
  return {
    props: {
      blogs: posts.blogs,
      recipes: posts.recipes,
      featuredPosts: [...featuredBlogs, ...featuredRecipes],
    },
    revalidate: 60,
  }
}

const Home = ({ blogs, featuredPosts, recipes }: HomePropType) => {
  const pageHeadData = (
    <Head>
      <title>Bobbieleelicious</title>
      <meta name="description" content="Delicious and nutritious healthy vegetarian recipes" />
    </Head>
  )

  if (!blogs && !featuredPosts && !recipes) {
    return <Spinner />
  }

  console.log('recipes----', recipes)
  return (
    <>
      {pageHeadData}
      <div className={styles.container}>
        <Carousel featuredPosts={featuredPosts} />
        <Subscribe />
        <FeatureList title="Recipes" articles={recipes.slice(0, 3)} slug="recipe" />
        <FeatureList title="Blogs" articles={blogs.slice(0, 3)} slug="blog" />
      </div>
    </>
  )
}

export default Home
