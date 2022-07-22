import React from 'react'
import { Link } from 'vtex.render-runtime'
interface SeeMoreButtonProps {
  term: string
  onSeeAllClick: (term: string) => void
  totalProducts: number
}
const SeeMoreButton = (props: SeeMoreButtonProps) => {
  const { term, totalProducts } = props

  return (
    <Link
      query={`map=ft&_q=${props.term}`}
      params={{
        term,
      }}
      page="store.search"
      onClick={() => props.onSeeAllClick(term)}
    >
      See all {totalProducts} whoop whoop
    </Link>
  )
}

export default SeeMoreButton
