import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'

interface SearchHistoryItem {
  label: string | JSX.Element
  value: string
  link: string
}

interface SearchHistoryProps {
  items: SearchHistoryItem[]
  onItemClick: (term: string, position: number) => void
}
const SearchHistory: FC<SearchHistoryProps> = props => {
  const { items } = props

  return (
    <article>
      <p>Recent</p>
      <hr />

      <ol>
        {items.map((item, i) => (
          <li key={item.value}>
            <Link
              page="store.search"
              params={{
                term: item.value,
              }}
              query={`map=ft&_q=${item.value}`}
              onClick={() => {
                props.onItemClick(item.value, i)
              }}
            >
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  )
}

export default SearchHistory
