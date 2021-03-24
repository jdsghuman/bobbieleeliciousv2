/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState, useEffect, ChangeEvent } from 'react'

interface ContextProp {
  filter: {
    searchTerm: string
    categories: string[]
    tags: string[]
  }
  updateFilter: (e: ChangeEvent<HTMLInputElement>) => void
  clearFilter: () => void
}
const SearchContext = createContext<ContextProp>({} as ContextProp)

const initialState = {
  searchTerm: '',
  categories: [],
  tags: [],
}

export function SearchContextProvider(props) {
  const [activeFilter, setActiveFilter] = useState(initialState)

  function clearFilterHandler() {
    setActiveFilter(initialState)
  }

  function updateFilterHandler(e) {
    setActiveFilter((prevData) => ({ ...prevData, [e.target.name]: e.target.value }))
  }

  const context = {
    filter: activeFilter,
    clearFilter: clearFilterHandler,
    updateFilter: updateFilterHandler,
  }
  return <SearchContext.Provider value={context}>{props.children}</SearchContext.Provider>
}

export default SearchContext
