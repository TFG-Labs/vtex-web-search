import React from 'react'
import { Link } from 'vtex.render-runtime'
import { encodeUrlString } from './string-utils'
import { useCssHandles } from 'vtex.css-handles'
interface SeeMoreButtonProps {
  onSeeAllClick: (term: string) => void
  inputValue: string
}

const CSS_HANDLES = [
  'seeMoreButtonLink',
  'seeMoreButtonText',
  'seeMoreButtonTerm',
] as const

const SeeMoreButton = (props: SeeMoreButtonProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
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
      className={handles.seeMoreButtonLink}
    >
      <p className={handles.seeMoreButtonText}>
        Search for{' '}
        <span className={handles.seeMoreButtonTerm}>
          &apos;{inputValue}&apos;
        </span>
      </p>
    </Link>
  )
}

export default SeeMoreButton
