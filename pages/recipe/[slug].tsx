import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner/Spinner'
import { RecipePropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import RecipeDetail from '../../components/RecipeController/RecipeDetail/RecipeDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner'

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
    revalidate: 60,
  }
}

const Recipe = ({ recipe, morePosts }: RecipePropType) => {
  const router = useRouter()

  let pageHeadData = (
    <Head>
      <title>Recipe</title>
    </Head>
  )

  if (router.isFallback) {
    return <Spinner />
  }

  if (!recipe) {
    return <Spinner />
  }

  pageHeadData = (
    <Head>
      <title>{recipe.fields.title}</title>
      <meta name="description" content={recipe.fields.description} />
    </Head>
  )

  console.log('recipe in slug', recipe)
  console.log('morePosts in slug', morePosts)
  return (
    <>
      {pageHeadData}
      <RecipeDetail post={recipe} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="recipe" />
      <Subscribe />
    </>
  )
}

export default Recipe
