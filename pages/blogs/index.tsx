import { useEffect, useState, useCallback, useRef } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getAllBlogs } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import PostItemContainer from '../../components/FeatureList/PostItemContainer'
import PosttItem from '../../components/FeatureList/PostItem'
import Subscribe from '../../components/Subscribe/Banner'
import useInfiniteScroll from '../../components/Util/Hooks/useInfiniteScroll'
import Spinner from '../../components/Spinner/Spinner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogs()
  return {
    props: {
      blogs: posts.blogs,
    },
    revalidate: 180,
  }
}

const Blogs = ({ blogs }: HomePropType) => {
  const [pageNumber, setPageNuber] = useState(0)
  const observer = useRef<any>()
  const { postsToShow, loading, hasMore, error } = useInfiniteScroll(pageNumber, blogs)

  const lastPostElementRef = useCallback(
    async (node) => {
      await initializeObserver()
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNuber((prevPageNumber) => prevPageNumber + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  async function initializeObserver() {
    if (!('IntersectionObserver' in window)) {
      //     // This is specifically for Safari - Polyfill
      await import('intersection-observer')
    }
  }

  const postMetaTags: MetaTags = {
    canonical: 'https://www.bobbieleelicious.com',
    description: `Delicious and nutritious healthy vegetarian recipes`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  useEffect(() => {
    setPageNuber(1)
  }, [])

  if (postsToShow.length === 0) return <Spinner />

  return (
    <>
      <Meta tags={postMetaTags} />
      <PostItemContainer title="blogs">
        {postsToShow.map((blog, index) => {
          if (postsToShow.length === index + 1) {
            return (
              <PosttItem
                lastRef={lastPostElementRef}
                key={blog.sys.id}
                article={blog}
                slug="blog"
              />
            )
          } else {
            return <PosttItem article={blog} key={blog.sys.id} slug="blog" lastRef={null} />
          }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </PostItemContainer>
      <Subscribe />
    </>
  )
}

export default Blogs
