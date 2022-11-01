type UpdateQuery = (prev: any, options: { fetchMoreResult: any }) => void
type FetchMoreOptions = {
  variables: { to: number; page?: number }
  updateQuery: UpdateQuery
}
type FetchMore = (options: FetchMoreOptions) => Promise<any>
type RefetchVariables = {
  from: number
  to: number
  count: number
  page: number
}
type Refetch = (options: Partial<RefetchVariables>) => Promise<any>

/**
 * Our Query depends on a `page` variable, but store-components' SearchContext
 * works with `from` and `to` variables. This methods provides a layer when
 * fetchMore is called to transform `to` into `page`.
 *
 * @param fetchMore Apollo's fetchMore function for our query.
 */
export const makeFetchMore = (
  fetchMore: FetchMore,
  page: number,
  setPage: (func: (page: number) => number) => number
): FetchMore => async ({ variables, updateQuery = () => {} }) => {
  const newPage = page + 1

  await fetchMore({
    updateQuery: makeUpdateQuery(newPage),
    variables: { ...variables, page: newPage },
  })

  setPage((page: number) => page + 1)

  return updateQuery(
    { productSearch: { products: [] } },
    {
      fetchMoreResult: {
        productSearch: { products: [] },
      },
    }
  )
}

/**
 * Our Query depends on a `page` variable, but store-components' SearchContext
 * works with `from` and `to` variables. This methods provides a layer when
 * refetch is called to transform `from` and `to` into `page` and `count`.
 *
 * @param refetch Apollo's refetch function for our query.
 */
export const makeRefetch = (refetch: Refetch): Refetch => async variables => {
  const { from, to } = variables
  const hasPagination = typeof from !== 'undefined' && typeof to !== 'undefined'

  const count = hasPagination ? to! - from! + 1 : undefined
  const page = hasPagination ? Math.round((to! + 1) / (to! - from!)) : undefined

  return await refetch({ from, to, page, count })
}

/**
 * UpdateQuery factory for our own query.
 *
 * @param page Page to search for.
 */
const makeUpdateQuery: (page: number) => UpdateQuery = page => (
  prev,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult || page === 1) return prev

  return {
    ...fetchMoreResult,
    searchResult: {
      ...fetchMoreResult.searchResult,
      products: [
        ...prev.searchResult.products,
        ...fetchMoreResult.searchResult.products,
      ],
    },
  }
}
