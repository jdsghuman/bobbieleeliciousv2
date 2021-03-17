import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import Image from 'next/image'
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

  console.log('blog in slug----', blog)
  console.log('morePosts in slug----', morePosts)

  return (
    <>
      {pageHeadData}
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h3>{blog.fields?.title}</h3>
        {blog.fields.image && (
          <div>
            <Image src={blog.fields.image} layout="intrinsic" width={500} height={500} />
          </div>
        )}
        <p>{blog.fields.author?.fields.name}</p>
        <p>{blog.fields.publishDate}</p>
        <Markdown>{blog.fields.body}</Markdown>
        {blog.fields.tag?.map((t) => (
          <p key={t.sys.id}>{t.fields.name}</p>
        ))}
      </div> */}
      <BlogDetail blog={blog} />
      <FeatureList title="More From Bobbieleelicious" articles={morePosts} slug="blog" />
      <Subscribe />
    </>
  )
}

export default Blog
