import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import styles from '@styles/Home.module.css'
import { HomePropType } from '../components/PropTypes/PropTypes'
import { getHomePageData } from '../lib/index'
import Subscribe from '../components/Subscribe/Banner/Banner'
import Spinner from '../components/Spinner'
import { MetaTags, PageType, RobotsContent } from '../components/PropTypes/Tags'
import Meta from '../components/Meta'
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
  const { featuredBlogs, featuredRecipes, latestBlogs, latestRecipes } = await getHomePageData()

  const featuredPosts = [
    ...featuredBlogs.map((blog) => ({
      ...blog,
      fields: {
        ...blog.fields,
        description:
          typeof blog.fields.description === 'string'
            ? blog.fields.description.slice(0, 155)
            : blog.fields.description,
      },
      type: 'blog',
    })),
    ...featuredRecipes.map((recipe) => ({
      ...recipe,
      fields: {
        ...recipe.fields,
        description:
          typeof recipe.fields.description === 'string'
            ? recipe.fields.description.slice(0, 155)
            : recipe.fields.description,
      },
      type: 'recipe',
    })),
  ].sort(
    (a, b) => new Date(b.fields.publishDate).valueOf() - new Date(a.fields.publishDate).valueOf()
  )

  return {
    props: {
      featuredPosts,
      latestBlogs: latestBlogs.map((blog) => ({ ...blog, type: 'blog' })),
      latestRecipes: latestRecipes.map((recipe) => ({ ...recipe, type: 'recipe' })),
    },
    revalidate: 86400,
  }
}

const Home = ({ featuredPosts, latestBlogs, latestRecipes }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const observer = useRef<any>()

  const [postsToDisplay, setPostsToDisplay] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

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
    if (searchCtx.filter.searchTerm.length === 0 && searchCtx.filter.categories.length === 0) return

    const controller = new AbortController()

    setSearchLoading(true)
    setPageNumber(1)

    const params = new URLSearchParams()
    if (searchCtx.filter.searchTerm) params.set('searchTerm', searchCtx.filter.searchTerm)
    if (searchCtx.filter.categories) params.set('categories', searchCtx.filter.categories)

    fetch(`/api/search?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setPostsToDisplay(data.results)
        setSearchLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Search request failed', err)
        setSearchLoading(false)
      })

    return () => controller.abort()
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

  if (!featuredPosts) {
    return <Spinner />
  }

  if (
    (postsToShow.length === 0 && searchCtx.filter.searchTerm.length > 0) ||
    (postsToShow.length === 0 && searchCtx.filter.categories.length > 0)
  ) {
    if (searchLoading) return <Spinner />
    return <PostsNotFound postType={'post'} />
  }

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bobbieleelicious',
    url: 'https://www.bobbieleelicious.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.bobbieleelicious.com/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <Meta tags={postMetaTags} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteLd)
              .replace(/&/g, '\\u0026')
              .replace(/</g, '\\u003c')
              .replace(/>/g, '\\u003e'),
          }}
        />
      </Head>
      <ScrollToTop />
      <PromptSubscribe />
      {searchCtx.filter.searchTerm === '' ? (
        <div className={styles.container}>
          <CarouselContainer featuredPosts={featuredPosts} />
          <Subscribe />
          <DynamicFeatureList title="Latest Recipes" articles={latestRecipes} slug="recipe" />
          <DynamicFeatureList title="Latest Blogs" articles={latestBlogs} slug="blog" />
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
