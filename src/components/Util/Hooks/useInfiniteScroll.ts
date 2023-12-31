import { useEffect, useState } from 'react'

export default function useInfiniteScroll(pageNumber, posts, query = '', categories = '') {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [postsToShow, setPostsToShow] = useState<any>([])
  const [hasMore, setHasMore] = useState(false)
  const [resetFilter, setResetFilter] = useState(false)

  useEffect(() => {
    setPostsToShow([])
    setResetFilter(true)
  }, [query, categories])

  useEffect(() => {
    setLoading(true)
    setError(false)
    if (!postsToShow && resetFilter) {
      setPostsToShow(posts.slice(0, 9))
    } else if (resetFilter) {
      setPostsToShow(posts.slice(0, 9))
      setResetFilter(false)
    } else {
      setPostsToShow((prevPosts) => {
        return [...prevPosts, ...posts.slice(postsToShow.length, postsToShow.length + 10)]
      })
    }
    setHasMore(posts.length > postsToShow.length)
    setLoading(false)
  }, [pageNumber, query, posts, categories])

  return { postsToShow, loading, hasMore, error }
}
