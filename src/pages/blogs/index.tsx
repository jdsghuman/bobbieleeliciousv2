import { useCallback, useRef, useContext } from 'react'
import { GetStaticProps } from 'next'
import { getAllBlogs, getAllCategories } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import PostItemContainer from '../../components/FeatureList/PostItemContainer'
import PosttItem from '../../components/FeatureList/PostItem'
import Subscribe from '../../components/Subscribe/Banner/Banner'
import useInfiniteScroll from '../../components/Util/Hooks/useInfiniteScroll'
import Spinner from '../../components/Spinner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import SearchContext from '../../store/search-context'
import PostsNotFound from '../../components/Filter/PostsNotFound'
import ScrollToTop from '../../components/ScrollToTop'
import Slider from '../../components/Slider'
import PromptSubscribe from '../../components/Subscribe/PromptSubscribe'
import useDisplayPosts from '../../components/Util/Hooks/useDisplayPosts'
import { loadPolyfills } from '../../components/Util/polyfills'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogs()
  const categories = await getAllCategories('categoryBlogs')
  return {
    props: {
      blogs: posts?.blogs,
      categories,
    },
    revalidate: 200,
  }
}

const Blogs = ({ blogs, categories }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const { postsToDisplay, pageNumber, setPageNumber } = useDisplayPosts(blogs, 'blogs')

  const observer = useRef<any>()
  const { postsToShow, loading, hasMore, error } = useInfiniteScroll(
    pageNumber,
    postsToDisplay,
    searchCtx.filter.searchTerm,
    searchCtx.filter.categories
  )

  const lastPostElementRef = useCallback(
    async (node) => {
      await loadPolyfills()
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

  const postMetaTags: MetaTags = {
    canonical: 'https://www.bobbieleelicious.com',
    description: `Healthy lifestyle and living`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

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
