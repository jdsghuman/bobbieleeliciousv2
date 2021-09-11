import { useEffect, useState, useCallback, useRef, useContext } from 'react'
import { GetStaticProps } from 'next'
import { getAllRecipes, getAllCategories } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import PostItemContainer from '../../components/FeatureList/PostItemContainer'
import PostItem from '../../components/FeatureList/PostItem'
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
import useDisplayPosts from '../../components/Util/Hooks/useDisplayPosts'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllRecipes()
  const categories = await getAllCategories('category')
  return {
    props: {
      recipes: posts.recipes,
      categories: categories,
    },
    revalidate: 200,
  }
}
const Recipes = ({ categories, recipes }: HomePropType) => {
  const searchCtx = useContext(SearchContext)
  const { postsToDisplay, pageNumber, setPageNumber } = useDisplayPosts(searchCtx, recipes)

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
    description: `Delicious and nutritious healthy vegetarian recipes`,
    image: 'https://www.bobbieleelicious.com/images/bobbieleelicious.png',
    robots: `${RobotsContent.follow},${RobotsContent.index}`,
    title: `Bobbieleelicious`,
    type: PageType.website,
  }

  if (
    (postsToShow.length === 0 && searchCtx.filter.searchTerm.length > 0) ||
    (postsToShow.length === 0 && searchCtx.filter.categories.length > 0)
  ) {
    return <PostsNotFound postType={'recipe'} />
  } else if (postsToShow.length === 0) {
    return <Spinner />
  }
  return (
    <>
      <Meta tags={postMetaTags} />
      <ScrollToTop />
      <PromptSubscribe />
      <Slider items={categories} />
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
