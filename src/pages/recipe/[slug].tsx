import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner'
import { RecipePropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import { supabase } from '../../lib/supabase'
import RecipeDetail from '../../components/RecipeController/RecipeDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner/Banner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import { truncateText } from '../../components/Util/Util'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe'

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
  const slugParam = params?.slug
  if (typeof slugParam !== 'string') {
    return { notFound: true }
  }

  const [post, morePosts, reviewsData] = await Promise.all([
    getPostBySlug('recipe', slugParam),
    getMorePosts('recipe', slugParam),
    supabase.from('recipe_reviews').select('rating').eq('slug', slugParam),
  ])

  if (!post || !morePosts) {
    return { notFound: true }
  }

  const ratings = reviewsData.data ?? []
  const ratingCount = ratings.length
  const ratingValue =
    ratingCount > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10
      : null

  return {
    props: {
      recipe: post,
      morePosts: morePosts ?? null,
      ratingValue,
      ratingCount,
    },
    revalidate: 86400,
  }
}

interface RecipePageProps extends RecipePropType {
  ratingValue: number | null
  ratingCount: number
}

const Recipe = ({ recipe, morePosts, ratingValue, ratingCount }: RecipePageProps) => {
  const router = useRouter()

  if (router.isFallback) {
    return <Spinner />
  }

  if (!recipe) {
    return <Spinner />
  }

  const postMetaTags: MetaTags = {
    canonical: `https://www.bobbieleelicious.com/recipe/${recipe.fields.slug}`,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.fields.title,
    image: recipe.fields.image,
    description: recipe.fields.metaDescription || truncateText(recipe.fields.description, 160),
    author: {
      '@type': 'Person',
      name: recipe.fields.author?.[0]?.fields?.name ?? 'Bobbieleelicious',
    },
    prepTime: recipe.fields.prep,
    cookTime: recipe.fields.cooktime,
    recipeYield: recipe.fields.servings,
    recipeIngredient: recipe.fields.ingredients
      ? recipe.fields.ingredients
          .split('--')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    recipeInstructions: recipe.fields.recipeDirections
      ? recipe.fields.recipeDirections
          .split('--')
          .map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text: s.trim(),
          }))
          .filter((s) => s.text)
      : [],
    ...(ratingValue !== null && ratingCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue,
            ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  const ScrollToTop = dynamic(
    () => {
      return import('../../components/ScrollToTop')
    },
    { ssr: false }
  )

  return (
    <>
      <Meta tags={postMetaTags} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <ScrollToTop />
      <PromptSubscribe />
      <RecipeDetail post={recipe} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="recipe" />
      <Subscribe />
    </>
  )
}

export default Recipe
