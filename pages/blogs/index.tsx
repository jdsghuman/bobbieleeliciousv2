import { useEffect, useState, useCallback, useRef } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { getAllBlogs } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import FeatureListItemContainer from '../../components/FeatureList/FeatureListItemContainer'
import FeatureListItem from '../../components/FeatureList/FeatureListItem'
import Subscribe from '../../components/Subscribe/Banner'
import useInfiniteScroll from '../../components/Util/Hooks/useInfiniteScroll'
import Spinner from '../../components/Spinner/Spinner'

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
    (node) => {
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

  useEffect(() => {
    setPageNuber(1)
  }, [])

  if (postsToShow.length === 0) return <Spinner />

  return (
    <>
      <Head>
        <title>Bobbieleelicious - Blog</title>
        <meta name="description" content="Delicious and nutritious healthy vegetarian recipes" />
      </Head>
      <FeatureListItemContainer title="blogs">
        {postsToShow.map((blog, index) => {
          if (postsToShow.length === index + 1) {
            return <FeatureListItem lastRef={lastPostElementRef} article={blog} slug="blog" />
          } else {
            return <FeatureListItem article={blog} slug="blog" lastRef={null} />
          }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </FeatureListItemContainer>
      <Subscribe />
    </>
  )
}

export default Blogs
