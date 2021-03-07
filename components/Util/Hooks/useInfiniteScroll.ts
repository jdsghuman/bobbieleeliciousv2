import { useEffect, useState } from 'react'

export default function useInfiniteScroll(pageNumber, posts, query = '') {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [postsToShow, setPostsToShow] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setPostsToShow([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    if (!postsToShow) {
      setPostsToShow(posts.slice(0, 9))
    } else {
      setPostsToShow((prevPosts) => {
        return [...prevPosts, ...posts.slice(postsToShow.length, postsToShow.length + 10)]
      })
    }
    setHasMore(posts.length > postsToShow.length)
    setLoading(false)
  }, [pageNumber, query])

  return { postsToShow, loading, hasMore, error }
}
