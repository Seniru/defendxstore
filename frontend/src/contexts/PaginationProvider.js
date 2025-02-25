import { createContext, useContext, useEffect, useState } from "react"

const PaginationContext = createContext()

export const PaginationProvider = ({ setPaginationInformation, children }) => {
  let [page, setPage] = useState(0)
  let [pageCount, setPageCount] = useState(children.length)

  const gotoNextPage = () => setPage(page + 1)
  const gotoPreviousPage = () => setPage(page - 1)

  useEffect(() => {
    setPageCount(children.length)
  }, [children.length])

  useEffect(() => {
    setPaginationInformation({
      page,
      pageCount,
    })
  }, [page, pageCount, setPaginationInformation])

  return (
    <PaginationContext.Provider
      value={{
        page,
        setPage,
        gotoNextPage,
        gotoPreviousPage,
      }}
    >
      {children[page]}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => {
  return useContext(PaginationContext)
}
