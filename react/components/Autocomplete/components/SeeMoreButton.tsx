import React from 'react'
import { Link } from 'vtex.render-runtime'
import { encodeUrlString } from '../../../utils/string-utils'
interface SeeMoreButtonProps {
  onSeeAllClick: (term: string) => void
  inputValue: string
}

const SeeMoreButton = (props: SeeMoreButtonProps) => {
  const { inputValue } = props
  const term = encodeUrlString(inputValue) || ''

  return (
    <Link
      query={`map=ft&_q=${term}`}
      params={{
        term,
      }}
      page="store.search"
      onClick={() => props.onSeeAllClick(term)}
    >
      Search for <span>&apos;{inputValue}&apos;</span>
    </Link>
  )
}

export default SeeMoreButton
