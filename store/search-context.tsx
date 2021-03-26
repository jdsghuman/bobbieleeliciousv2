import { createContext, useState } from 'react'

interface ContextProp {
  filter: {
    searchTerm: string
    categories: string[]
    tags: string[]
  }
  updateFilter: (name, value) => void
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

  function updateFilterHandler(name, value) {
    setActiveFilter((prevData) => ({ ...prevData, [name]: value }))
  }

  const context = {
    filter: activeFilter,
    clearFilter: clearFilterHandler,
    updateFilter: updateFilterHandler,
  }
  return <SearchContext.Provider value={context}>{props.children}</SearchContext.Provider>
}

export default SearchContext
