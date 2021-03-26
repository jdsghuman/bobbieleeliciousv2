import { useEffect, useState, useCallback, useRef, useContext } from 'react'
import { GetStaticProps } from 'next'
import { getAllRecipes } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import PostItemContainer from '../../components/FeatureList/PostItemContainer'
import PostItem from '../../components/FeatureList/PostItem'
import Subscribe from '../../components/Subscribe/Banner'
import useInfiniteScroll from '../../components/Util/Hooks/useInfiniteScroll'
import Spinner from '../../components/Spinner/Spinner'
import { MetaTags, PageType, RobotsContent } from '../../components/PropTypes/Tags'
import Meta from '../../components/Meta'
import SearchContext from '../../store/search-context'
import FilterApplied from '../../components/Filter/FilterApplied/FilterApplied'
import PostsNotFound from '../../components/Filter/PostsNotFound/PostsNotFound'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllRecipes()
  return {
    props: {
      recipes: posts.recipes,
    },
    revalidate: 180,
  }
}
const Recipes = ({ recipes }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const [postsToDisplay, setPostsToDisplay] = useState([])

  const [pageNumber, setPageNumber] = useState(0)
  const observer = useRef<any>()

  const { postsToShow, loading, hasMore, error } = useInfiniteScroll(
    pageNumber,
    postsToDisplay,
    searchCtx.filter.searchTerm
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
    description: `Delicious and nutritious healthy vegetarian recipes`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length > 0) {
      setPageNumber(1)
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.fields.title.toLowerCase().includes(searchCtx.filter.searchTerm.toLowerCase())
      )
      setPostsToDisplay(filteredRecipes)
    } else if (searchCtx.filter.searchTerm.length === 0) {
      setPageNumber(1)
      setPostsToDisplay(recipes)
    }
  }, [searchCtx.filter.searchTerm])

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length === 0) {
      setPageNumber(1)
      setPostsToDisplay(recipes)
    }
  }, [searchCtx.filter.searchTerm])

  useEffect(() => {
    setPageNumber(1)
    setPostsToDisplay(recipes)
  }, [])

  if (postsToShow.length === 0 && searchCtx.filter.searchTerm.length > 0) {
    return <PostsNotFound />
  } else if (postsToShow.length === 0) {
    return <Spinner />
  }
  return (
    <>
      <Meta tags={postMetaTags} />
      <FilterApplied />
      <PostItemContainer title="recipes">
        {postsToShow.map((recipe, index) => {
          if (postsToShow.length === index + 1) {
            return (
              <PostItem
                key={recipe.sys.id}
                lastRef={lastPostElementRef}
                article={recipe}
                slug="recipe"
              />
            )
          } else {
            return <PostItem key={recipe.sys.id} article={recipe} slug="recipe" lastRef={null} />
          }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </PostItemContainer>
      <Subscribe />
    </>
  )
}

export default Recipes
