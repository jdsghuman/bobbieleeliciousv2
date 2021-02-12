import Markdown from 'markdown-to-jsx'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BlogPropType } from '../../components/PropTypes/PropTypes'
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'

export async function getStaticPaths() {
  const data = await getAllPostsWithSlug('blogPost')

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug('blogPost', params.slug)
  const morePosts = await getMorePosts('blogPost', params.slug)
  return {
    props: {
      blog: post,
      morePosts: morePosts ? morePosts : null,
    },
    revalidate: 60,
  }
}

const Blog = ({ blog }: BlogPropType) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div
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
    </div>
  )
}

export default Blog
