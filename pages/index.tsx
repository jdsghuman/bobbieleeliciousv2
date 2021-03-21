import { GetStaticProps } from 'next'
import styles from '../styles/Home.module.css'
import { HomePropType } from '../components/PropTypes/PropTypes'
import { getAllPosts } from '../lib/index'
import Carousel from '../components/Carousel/Carousel'
import Subscribe from '../components/Subscribe/Banner'
import FeatureList from '../components/FeatureList/FeatureList'
import Spinner from '../components/Spinner/Spinner'
import { MetaTags, PageType, RobotsContent } from '../components/PropTypes/Tags'
import Meta from '../components/Meta'

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
  const postMetaTags: MetaTags = {
    canonical: 'https://www.bobbieleelicious.com',
    description: `Delicious and nutritious healthy vegetarian recipes`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  if (!blogs && !featuredPosts && !recipes) {
    return <Spinner />
  }
  return (
    <>
      <Meta tags={postMetaTags} />
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
