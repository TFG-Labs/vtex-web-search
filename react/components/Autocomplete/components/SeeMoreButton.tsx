import React from 'react'
import { Link } from 'vtex.render-runtime'
interface SeeMoreButtonProps {
  term: string
  onSeeAllClick: (term: string) => void
}

const SeeMoreButton = (props: SeeMoreButtonProps) => {
  const { term } = props

  return (
    <Link
      query={`map=ft&_q=${props.term}`}
      params={{
        term,
      }}
      page="store.search"
      onClick={() => props.onSeeAllClick(term)}
    >
      See all
    </Link>
  )
}

export default SeeMoreButton
