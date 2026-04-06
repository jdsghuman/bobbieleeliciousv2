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
import { truncateText, safeJsonLd } from '../../components/Util/Util'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe'

// Converts freeform time strings (e.g. "1 hour 30 mins") to ISO 8601 duration (e.g. "PT1H30M").
// Returns undefined if the string can't be parsed, so the field is omitted from JSON-LD.
function toIsoDuration(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const lower = value.toLowerCase()
  const hours = lower.match(/(\d+)\s*h(our|r)?s?/)
  const minutes = lower.match(/(\d+)\s*m(in|ins|inute|inutes)?/)
  const h = hours ? parseInt(hours[1], 10) : 0
  const m = minutes ? parseInt(minutes[1], 10) : 0
  if (h === 0 && m === 0) return undefined
  return `PT${h > 0 ? `${h}H` : ''}${m > 0 ? `${m}M` : ''}`
}

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

  if (reviewsData.error) {
    console.error(`Error fetching reviews for recipe slug "${slugParam}":`, reviewsData.error)
  }
  const ratings = !reviewsData.error && Array.isArray(reviewsData.data) ? reviewsData.data : []
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

  const authorName = recipe.fields.author?.[0]?.fields?.name ?? 'Bobbieleelicious'
  const categoryName = recipe.fields.category?.fields?.name
  const description = recipe.fields.metaDescription
    ? recipe.fields.metaDescription
    : truncateText(recipe.fields.description, 160)
  const canonicalUrl = `https://www.bobbieleelicious.com/recipe/${recipe.fields.slug}`

  const postMetaTags: MetaTags = {
    canonical: canonicalUrl,
    description,
    image: `${recipe.fields.image}`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `${recipe.fields.title}`,
    type: PageType.article,
    twitter_card: 'summary_large_image',
    ...(recipe.fields.publishDate && { article_publishedTime: recipe.fields.publishDate }),
    article_author: 'https://www.bobbieleelicious.com/about',
    article_author_name: authorName,
    ...(categoryName && { article_section: categoryName }),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bobbieleelicious.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Recipes',
        item: 'https://www.bobbieleelicious.com/recipes',
      },
      { '@type': 'ListItem', position: 3, name: recipe.fields.title, item: canonicalUrl },
    ],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.fields.title,
    image: recipe.fields.image,
    description,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    prepTime: toIsoDuration(recipe.fields.prep),
    cookTime: toIsoDuration(recipe.fields.cooktime),
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
          .map((s) => s.trim())
          .filter(Boolean)
          .map((text, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text,
          }))
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
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
