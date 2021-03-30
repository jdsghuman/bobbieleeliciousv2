import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner/Spinner'
import { RecipePropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import RecipeDetail from '../../components/RecipeController/RecipeDetail/RecipeDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import { truncateText } from '../../components/Util/Util'

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getAllPostsWithSlug('recipe')

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug('recipe', params.slug)
  const morePosts = await getMorePosts('recipe', params.slug)

  if (!post || !morePosts) {
    return { notFound: true }
  }

  return {
    props: {
      recipe: post,
      morePosts: morePosts ? morePosts : null,
    },
    revalidate: 600,
  }
}

const Recipe = ({ recipe, morePosts }: RecipePropType) => {
  const router = useRouter()

  if (router.isFallback) {
    return <Spinner />
  }

  if (!recipe) {
    return <Spinner />
  }

  const postMetaTags: MetaTags = {
    canonical: 'https://www.bobbieleelicious.com',
    description: `${
      recipe.fields.metaDescription
        ? recipe.fields.metaDescription
        : truncateText(recipe.fields.description, 160)
    }`,
    image: `${recipe.fields.image}`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `${recipe.fields.title}`,
    type: PageType.article,
  }

  const ScrollToTop = dynamic(
    () => {
      return import('../../components/ScrollToTop/ScrollToTop')
    },
    { ssr: false }
  )

  return (
    <>
      <Meta tags={postMetaTags} />
      <ScrollToTop />
      <RecipeDetail post={recipe} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="recipe" />
      <Subscribe />
    </>
  )
}

export default Recipe
