import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Spinner from '../../components/Spinner'
import { BlogPropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'
import BlogDetail from '../../components/BlogController/BlogDetail'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner/Banner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import { truncateText } from '../../components/Util/Util'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe'

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
  const post = await getPostBySlug('blogPost', params?.slug)
  const morePosts = await getMorePosts('blogPost', params?.slug)

  if (!post || !morePosts) {
    return { notFound: true }
  }

  return {
    props: {
      blog: post,
      morePosts: morePosts ? morePosts : null,
    },
    revalidate: 86400,
  }
}

const Blog = ({ blog, morePosts }: BlogPropType) => {
  const router = useRouter()

  if (router.isFallback) {
    return <Spinner />
  }

  if (!blog) {
    return <Spinner />
  }

  const postMetaTags: MetaTags = {
    canonical: `https://www.bobbieleelicious.com/blog/${blog.fields.slug}`,
    description: `${
      blog.fields.metaDescription
        ? blog.fields.metaDescription
        : truncateText(blog.fields.description, 160)
    }`,
    image: `${blog.fields.image}`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `${blog.fields.title}`,
    type: PageType.article,
    twitter_card: 'summary_large_image',
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.fields.title,
    description: blog.fields.metaDescription || truncateText(blog.fields.description, 160),
    image: blog.fields.image ? [blog.fields.image] : undefined,
    author: blog.fields.author?.fields?.name
      ? { '@type': 'Person', name: blog.fields.author.fields.name }
      : undefined,
    datePublished: blog.fields.publishDate,
    publisher: {
      '@type': 'Organization',
      name: 'Bobbieleelicious',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bobbieleelicious.com/favicon.ico',
      },
    },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      </Head>
      <ScrollToTop />
      <PromptSubscribe />
      <BlogDetail blog={blog} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="blog" />
      <Subscribe />
    </>
  )
}

export default Blog
