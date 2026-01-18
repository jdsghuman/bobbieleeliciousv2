import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import styles from '@styles/Home.module.css'
import { HomePropType } from '../components/PropTypes/PropTypes'
import { getAllRecipes, getAllBlogs } from '../lib/index'
import Subscribe from '../components/Subscribe/Banner/Banner'
import Spinner from '../components/Spinner'
import { MetaTags, PageType, RobotsContent } from '../components/PropTypes/Tags'
import Meta from '../components/Meta'
import generateSitemap from '../lib/generateSitemap'
import PromptSubscribe from '../components/Subscribe/PromptSubscribe'
import SearchContext from '../store/search-context'
import useInfiniteScroll from '../components/Util/Hooks/useInfiniteScroll'
import PostsNotFound from '../components/Filter/PostsNotFound'
import PostItemContainer from '../components/FeatureList/PostItemContainer'
import PostItem from '../components/FeatureList/PostItem'
import { loadPolyfills } from '../components/Util/polyfills'
import CarouselContainer from '@components/Carousel'

const DynamicFeatureList = dynamic(() => import('@components/FeatureList/FeatureList'), {
  loading: () => <p>Loading...</p>,
})
export const getStaticProps: GetStaticProps = async () => {
  await generateSitemap()
  const posts = await getAllBlogs()

  const updatedBlogs = posts?.blogs.map((blog) => {
    if (typeof blog.fields.description === 'string') {
      blog.fields.description = blog.fields.description.slice(0, 155)
    }
    blog.type = 'blog'

    return blog
  })

  const allRecipesNoMaxLimit = await getAllRecipes()

  const updatedRecipes = allRecipesNoMaxLimit?.recipes.map((recipe) => {
    if (typeof recipe.fields.description === 'string') {
      recipe.fields.description = recipe.fields.description.slice(0, 155)
    }
    recipe.type = 'recipe'

    return recipe
  })

  const featuredBlogs = posts?.blogs.filter((blog) => blog.fields.featured)

  const featuredRecipes = allRecipesNoMaxLimit?.recipes.filter((recipe) => recipe.fields.featured)
  return {
    props: {
      blogs: updatedBlogs,
      recipes: updatedRecipes,
      featuredPosts: [...featuredBlogs, ...featuredRecipes].sort(
        (a, b) =>
          new Date(b.fields.publishDate).valueOf() - new Date(a.fields.publishDate).valueOf()
      ),
    },
    revalidate: 86400,
  }
}

const Home = ({ blogs, featuredPosts, recipes }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const observer = useRef<any>()

  const [postsToDisplay, setPostsToDisplay] = useState([])

  const [pageNumber, setPageNumber] = useState(0)
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
    description: `Delicious and nutritious healthy vegetarian recipes and lifestyle blog`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  const ScrollToTop = dynamic(
    () => {
      return import('../components/ScrollToTop')
    },
    { ssr: false }
  )

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0) {
      setPageNumber(1)
      let filteredPosts: any = []
      if (searchCtx.filter.searchTerm.length > 0 && searchCtx.filter.categories.length === 0) {
        filteredPosts = [
          ...blogs.filter((blog) =>
            blog.fields.title
              .toLowerCase()
              .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
          ),
          ...recipes.filter((recipe) =>
            recipe.fields.title
              .toLowerCase()
              .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
          ),
        ]
      } else if (
        searchCtx.filter.categories.length > 0 &&
        searchCtx.filter.searchTerm.length === 0
      ) {
        filteredPosts = [
          ...blogs.filter((blog) =>
            blog?.fields?.category[0]?.fields?.name
              .toLowerCase()
              .includes(searchCtx.filter.categories.toLowerCase())
          ),
          ...recipes.filter((recipe) =>
            recipe?.fields?.category?.fields?.name
              .toLowerCase()
              .includes(searchCtx.filter.categories.toLowerCase())
          ),
        ]
      } else {
        filteredPosts = [
          ...blogs.filter(
            (blog) =>
              blog?.fields?.category[0]?.fields?.name
                .toLowerCase()
                .includes(searchCtx.filter.categories.toLowerCase()) &&
              blog.fields.title
                .toLowerCase()
                .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
          ),
          ...recipes.filter(
            (recipe) =>
              recipe?.fields?.category?.fields?.name
                .toLowerCase()
                .includes(searchCtx.filter.categories.toLowerCase()) &&
              recipe.fields.title
                .toLowerCase()
                .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
          ),
        ]
      }
      setPostsToDisplay(filteredPosts)
    }
  }, [searchCtx.filter.searchTerm, searchCtx.filter.categories])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          // eslint-disable-next-line prefer-const
          for (let registration of registrations) {
            registration.unregister()
          }
        })
      })
    }
  }, [])

  if (!blogs && !featuredPosts && !recipes) {
    return <Spinner />
  }

  if (
    (postsToShow.length === 0 && searchCtx.filter.searchTerm.length > 0) ||
    (postsToShow.length === 0 && searchCtx.filter.categories.length > 0)
  ) {
    return <PostsNotFound postType={'post'} />
  }

  return (
    <>
      <Meta tags={postMetaTags} />
      <ScrollToTop />
      <PromptSubscribe />
      {searchCtx.filter.searchTerm === '' ? (
        <div className={styles.container}>
          <CarouselContainer featuredPosts={featuredPosts} />
          <Subscribe />
          <DynamicFeatureList title="Latest Recipes" articles={recipes.slice(0, 3)} slug="recipe" />
          <DynamicFeatureList title="Latest Blogs" articles={blogs.slice(0, 3)} slug="blog" />
        </div>
      ) : (
        <PostItemContainer title="posts">
          {postsToShow.map((post, index) => {
            if (postsToShow.length === index + 1) {
              return (
                <PostItem
                  lastRef={lastPostElementRef}
                  key={post.sys.id}
                  article={post}
                  slug={post.type === 'blog' ? 'blog' : 'recipe'}
                />
              )
            } else {
              return (
                <PostItem
                  article={post}
                  key={post.sys.id}
                  slug={post.type === 'blog' ? 'blog' : 'recipe'}
                  lastRef={null}
                />
              )
            }
          })}
          <div>{loading && 'Loading...'}</div>
          <div>{error && 'Error'}</div>
        </PostItemContainer>
      )}
    </>
  )
}

Home.displayName = 'Home'

export default Home
