import { useEffect, useState, useCallback, useRef, useContext } from 'react'
import { GetStaticProps } from 'next'
import { getAllBlogs, getAllCategories } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import PostItemContainer from '../../components/FeatureList/PostItemContainer'
import PosttItem from '../../components/FeatureList/PostItem'
import Subscribe from '../../components/Subscribe/Banner/Banner'
import useInfiniteScroll from '../../components/Util/Hooks/useInfiniteScroll'
import Spinner from '../../components/Spinner/Spinner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import SearchContext from '../../store/search-context'
import PostsNotFound from '../../components/Filter/PostsNotFound/PostsNotFound'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
import Slider from '../../components/Slider/Slider'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe/PromptSubscribe'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogs()
  const categories = await getAllCategories('categoryBlogs')
  return {
    props: {
      blogs: posts.blogs,
      categories: categories,
    },
    revalidate: 200,
  }
}

const Blogs = ({ blogs, categories }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const [postsToDisplay, setPostsToDisplay] = useState([])

  const [pageNumber, setPageNumber] = useState(0)
  const observer = useRef<any>()
  const { postsToShow, loading, hasMore, error } = useInfiniteScroll(
    pageNumber,
    postsToDisplay,
    searchCtx.filter.searchTerm,
    searchCtx.filter.categories
  )

  const lastPostElementRef = useCallback(
    async (node) => {
      await initializeObserver()
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1)
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
    description: `Healthy lifestyle and living`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0) {
      setPageNumber(1)
      let filteredBlogs = []

      if (searchCtx.filter.searchTerm.length > 0 && searchCtx.filter.categories.length === 0) {
        filteredBlogs = blogs.filter((blog) =>
          blog.fields.title.toLowerCase().includes(searchCtx.filter.searchTerm.toLowerCase().trim())
        )
      } else if (
        searchCtx.filter.categories.length > 0 &&
        searchCtx.filter.searchTerm.length === 0
      ) {
        filteredBlogs = blogs.filter((blog) =>
          blog?.fields?.category[0]?.fields?.name
            .toLowerCase()
            .includes(searchCtx.filter.categories.toLowerCase())
        )
      } else {
        filteredBlogs = blogs.filter(
          (blog) =>
            blog?.fields?.category[0]?.fields?.name
              .toLowerCase()
              .includes(searchCtx.filter.categories.toLowerCase()) &&
            blog.fields.title
              .toLowerCase()
              .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
        )
      }
      setPostsToDisplay(filteredBlogs)
    } else if (
      searchCtx.filter.searchTerm.length === 0 &&
      searchCtx.filter.categories.length === 0
    ) {
      setPageNumber(1)
      setPostsToDisplay(blogs)
    }
  }, [searchCtx.filter.searchTerm, searchCtx.filter.categories])

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length === 0 && searchCtx.filter.categories.length === 0) {
      setPageNumber(1)
      setPostsToDisplay(blogs)
    }
  }, [searchCtx.filter.searchTerm, searchCtx.filter.categories])

  useEffect(() => {
    setPageNumber(1)
    setPostsToDisplay(blogs)
  }, [])

  if (
    (postsToShow.length === 0 && searchCtx.filter.searchTerm.length > 0) ||
    (postsToShow.length === 0 && searchCtx.filter.categories.length > 0)
  ) {
    return <PostsNotFound postType={'blog'} />
  } else if (postsToShow.length === 0) {
    return <Spinner />
  }
  return (
    <>
      <Meta tags={postMetaTags} />
      <ScrollToTop />
      <Slider items={categories} />
      <PromptSubscribe />
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
