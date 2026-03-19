import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner'
import { RecipePropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import RecipeDetail from '../../components/RecipeController/RecipeDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner/Banner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import { truncateText, toDuration } from '../../components/Util/Util'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe'
import { supabase } from '../../lib/supabase'

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
  const post = await getPostBySlug('recipe', params?.slug)
  const morePosts = await getMorePosts('recipe', params?.slug)

  if (!post || !morePosts) {
    return { notFound: true }
  }

  const { data: ratingData } = await supabase
    .from('recipe_reviews')
    .select('rating')
    .eq('slug', params?.slug)

  const ratings = ratingData ?? []
  const aggregateRating =
    ratings.length > 0
      ? {
          ratingCount: ratings.length,
          ratingValue:
            Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10,
        }
      : null

  return {
    props: {
      recipe: post,
      morePosts: morePosts ? morePosts : null,
      aggregateRating,
    },
    revalidate: 86400,
  }
}

const Recipe = ({ recipe, morePosts, aggregateRating }: RecipePropType) => {
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
    twitter_card: 'summary_large_image',
  }

  const recipeJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.fields.title,
    description: recipe.fields.metaDescription || truncateText(recipe.fields.description, 160),
    image: recipe.fields.image ? [recipe.fields.image] : undefined,
    author: recipe.fields.author?.[0]?.fields?.name
      ? { '@type': 'Person', name: recipe.fields.author[0].fields.name }
      : undefined,
    datePublished: recipe.fields.publishDate,
    prepTime: toDuration(recipe.fields.prep),
    cookTime: toDuration(recipe.fields.cooktime),
    recipeCategory: recipe.fields.category?.fields?.name,
    keywords: recipe.fields.tag?.map((t) => t.fields.name).join(', '),
    aggregateRating: aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: aggregateRating.ratingValue,
          ratingCount: aggregateRating.ratingCount,
        }
      : undefined,
  }
  // Remove undefined fields
  Object.keys(recipeJsonLd).forEach(
    (key) => recipeJsonLd[key] === undefined && delete recipeJsonLd[key]
  )

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
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
