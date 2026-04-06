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
import { truncateText, safeJsonLd } from '../../components/Util/Util'
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
  const slugParam = params?.slug
  if (typeof slugParam !== 'string') {
    return { notFound: true }
  }

  const post = await getPostBySlug('blogPost', slugParam)
  const morePosts = await getMorePosts('blogPost', slugParam)

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

  const authorName = blog.fields.author?.fields?.name ?? 'Bobbieleelicious'
  const categoryName = blog.fields.category?.fields?.name
  const description = blog.fields.metaDescription
    ? blog.fields.metaDescription
    : truncateText(blog.fields.description, 160)
  const canonicalUrl = `https://www.bobbieleelicious.com/blog/${blog.fields.slug}`

  const postMetaTags: MetaTags = {
    canonical: canonicalUrl,
    description,
    image: `${blog.fields.image}`,
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `${blog.fields.title}`,
    type: PageType.article,
    twitter_card: 'summary_large_image',
    ...(blog.fields.publishDate && { article_publishedTime: blog.fields.publishDate }),
    article_author: authorName,
    ...(categoryName && { article_section: categoryName }),
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.fields.title,
    description,
    image: blog.fields.image,
    url: canonicalUrl,
    datePublished: blog.fields.publishDate,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bobbieleelicious',
      url: 'https://www.bobbieleelicious.com',
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bobbieleelicious.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogs',
        item: 'https://www.bobbieleelicious.com/blogs',
      },
      { '@type': 'ListItem', position: 3, name: blog.fields.title, item: canonicalUrl },
    ],
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
      <BlogDetail blog={blog} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="blog" />
      <Subscribe />
    </>
  )
}

export default Blog
