import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import SearchContext from '../../../store/search-context'

export default function useDisplayPosts(posts, type) {
  const [postsToDisplay, setPostsToDisplay] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const searchCtx = useContext(SearchContext)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(router.asPath.split('?')[1] || '')
    const q = params.get('q') || ''
    const category = params.get('category') || ''

    searchCtx.updateFilter('searchTerm', q)
    searchCtx.updateFilter('categories', category)

    setPageNumber(1)

    if (!q && !category) {
      setPostsToDisplay(posts)
      return
    }

    let filtered = posts
    if (q && !category) {
      filtered = posts.filter((p) => p.fields.title.toLowerCase().includes(q.toLowerCase().trim()))
    } else if (category && !q) {
      filtered = posts.filter((p) =>
        p?.fields?.category?.fields?.name?.toLowerCase()?.includes(category.toLowerCase())
      )
    } else {
      filtered = posts.filter(
        (p) =>
          p?.fields?.category?.fields?.name?.toLowerCase()?.includes(category.toLowerCase()) &&
          p.fields.title.toLowerCase().includes(q.toLowerCase().trim())
      )
    }
    setPostsToDisplay(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return {
    postsToDisplay,
    pageNumber,
    setPageNumber,
  }
}
