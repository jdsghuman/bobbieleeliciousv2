import Markdown from 'markdown-to-jsx'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner/Spinner'
import { RecipePropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'

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

  if (router.isFallback) {
    return <Spinner />
  }

  if (!recipe) {
    return <Spinner />
  }

  return (
    <>
      <div>{recipe.fields.title}</div>
      {recipe.fields.image && (
        <div>
          <Image src={recipe.fields.image} layout="intrinsic" width={500} height={500} />
        </div>
      )}
      <p>{recipe.fields.publishDate}</p>
      <p>{recipe.fields.category.fields.name}</p>
      {recipe.fields.author?.length && <p>{recipe.fields.author[0]?.fields.name}</p>}
      <Markdown>{recipe.fields.description}</Markdown>
      {recipe.fields.tag?.map((t) => (
        <p key={t.sys.id}>{t.fields.name}</p>
      ))}
    </>
  )
}

export default Recipe
