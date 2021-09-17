import { useEffect, useState, useContext } from 'react'
import SearchContext from '../../../store/search-context'

export default function useDisplayPosts(posts, type) {
  const [postsToDisplay, setPostsToDisplay] = useState([])
  const [pageNumber, setPageNumber] = useState(0)
  const searchCtx = useContext(SearchContext)
  useEffect(() => {
    if (searchCtx.filter.searchTerm.length > 0 || searchCtx.filter.categories.length > 0) {
      setPageNumber(1)
      let filteredPosts = []
      if (searchCtx.filter.searchTerm.length > 0 && searchCtx.filter.categories.length === 0) {
        filteredPosts = posts.filter((post) =>
          post.fields.title.toLowerCase().includes(searchCtx.filter.searchTerm.toLowerCase().trim())
        )
      } else if (
        searchCtx.filter.categories.length > 0 &&
        searchCtx.filter.searchTerm.length === 0
      ) {
        filteredPosts = posts.filter((post) => {
          if (type === 'recipes') {
            return post?.fields?.category?.fields?.name
              .toLowerCase()
              .includes(searchCtx.filter.categories.toLowerCase())
          } else {
            return post?.fields?.category[0]?.fields?.name
              .toLowerCase()
              .includes(searchCtx.filter.categories.toLowerCase())
          }
        })
      } else {
        filteredPosts = posts.filter((post) => {
          if (type === 'recipes') {
            return (
              post?.fields?.category?.fields?.name
                .toLowerCase()
                .includes(searchCtx.filter.categories.toLowerCase()) &&
              post.fields.title
                .toLowerCase()
                .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
            )
          } else {
            return (
              post?.fields?.category[0]?.fields?.name
                .toLowerCase()
                .includes(searchCtx.filter.categories.toLowerCase()) &&
              post.fields.title
                .toLowerCase()
                .includes(searchCtx.filter.searchTerm.toLowerCase().trim())
            )
          }
        })
      }
      setPostsToDisplay(filteredPosts)
    } else if (
      searchCtx.filter.searchTerm.length === 0 &&
      searchCtx.filter.categories.length === 0
    ) {
      setPageNumber(1)
      setPostsToDisplay(posts)
    }
  }, [searchCtx.filter.searchTerm, searchCtx.filter.categories])

  useEffect(() => {
    if (searchCtx.filter.searchTerm.length === 0 && searchCtx.filter.categories.length === 0) {
      setPageNumber(1)
      setPostsToDisplay(posts)
    }
  }, [searchCtx.filter.searchTerm, searchCtx.filter.categories])

  useEffect(() => {
    setPageNumber(1)
    setPostsToDisplay(posts)
  }, [])
  return {
    postsToDisplay,
    pageNumber,
    setPageNumber,
  }
}
