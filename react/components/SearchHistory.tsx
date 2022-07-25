import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'
import { searchHistory, transformSearchHistory } from './utils'

interface SearchHistoryProps {
  onItemClick: (term: string, position: number) => void
}
const SearchHistory: FC<SearchHistoryProps> = props => {
  const history = searchHistory()
  const historyItems = transformSearchHistory(history)

  return (
    <article>
      <p>Recently</p>
      <hr />

      <ol>
        {historyItems.map((item, i) => (
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
