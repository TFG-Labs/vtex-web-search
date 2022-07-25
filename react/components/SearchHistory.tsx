import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import { searchHistory, transformSearchHistory } from './utils'

interface SearchHistoryProps {
  onItemClick: (term: string, position: number) => void
}

const CSS_HANDLES = [
  'searchHistoryWrapper',
  'searchHistoryLink',
  'searchHistoryTitle',
  'searchHistoryLi',
  'searchHistoryOl',
] as const

const SearchHistory: FC<SearchHistoryProps> = props => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const history = searchHistory()
  const historyItems = transformSearchHistory(history)

  return (
    <article className={handles.searchHistoryWrapper}>
      <h4 className={handles.searchHistoryTitle}>Recent</h4>
      <ol className={handles.searchHistoryOl}>
        {historyItems.map((item, i) => (
          <li key={item.value} className={handles.searchHistoryLi}>
            <Link
              className={handles.searchHistoryLink}
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
