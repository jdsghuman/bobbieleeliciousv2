import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner/Spinner'
import { BlogPropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import BlogDetail from '../../components/BlogController/BlogDetail/BlogDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner'

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getAllPostsWithSlug('blogPost')

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug('blogPost', params.slug)
  const morePosts = await getMorePosts('blogPost', params.slug)

  if (!post || !morePosts) {
    return { notFound: true }
  }

  return {
    props: {
      blog: post,
      morePosts: morePosts ? morePosts : null,
    },
    revalidate: 60,
  }
}

const Blog = ({ blog, morePosts }: BlogPropType) => {
  const router = useRouter()

  let pageHeadData = (
    <Head>
      <title>Bobbieleelicous - Blog</title>
      <meta name="description" content={`Healthy, lifstyle blog`} />
    </Head>
  )

  if (router.isFallback) {
    return <Spinner />
  }

  if (!blog) {
    return <Spinner />
  }

  pageHeadData = (
    <Head>
      <title>{blog.fields.title}</title>
      <meta name="description" content={blog.fields.description} />
    </Head>
  )
  return (
    <>
      {pageHeadData}
      <BlogDetail blog={blog} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="blog" />
      <Subscribe />
    </>
  )
}

export default Blog
