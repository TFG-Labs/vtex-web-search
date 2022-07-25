import React from 'react'
import { ISuggestionQueryResponseSearch } from '../utils/biggy-client'
import { Item } from './Autocomplete/components/SuggestionSection/types'
import { decodeUrlString } from '../utils/string-utils'
import { getCookie, setCookie } from '../utils/dom-utils'

/**
 * Given a query and a label: wrap the term in a bold span for styling
 */

const highlightTerm = (label: string, query: string) => {
  const splittedLabel = label.split(query)

  return (
    <>
      {splittedLabel.map((str: string, index: number) => {
        return (
          <>
            {str}
            {index !== splittedLabel.length - 1 ? (
              <span className="b">{query}</span>
            ) : null}
          </>
        )
      })}
    </>
  )
}

/**
 * Take the returned suggested products and change the shape to be consumed by the frontend
 */

export const transformSearchSuggestions = (
  searches: ISuggestionQueryResponseSearch[],
  inputValue: string
) => {
  const MAX_SUGGESTED_TERMS = 9

  const items = searches.slice(0, MAX_SUGGESTED_TERMS).map(query => {
    const attributes = query.attributes || []

    return {
      term: query.term,
      attributes: attributes.map(att => ({
        label: att.labelValue,
        value: att.value,
        link: `/${query.term}/${att.value}/?map=ft,${att.key}`,
        groupValue: query.term,
        key: att.key,
      })),
    }
  })

  const suggestionItems: Item[] = items.map(({ term, attributes }) => ({
    label: highlightTerm(term.toLowerCase(), inputValue),
    value: term,
    groupValue: term,
    link: `/${term}?map=ft`,
    attributes,
  }))

  return suggestionItems
}

/**
 * Take the returned history and transform it n
 */
export const transformSearchHistory = (searchItems: string[]) => {
  const MAX_HISTORY = 5

  const result = searchItems.slice(0, MAX_HISTORY).map((item: string) => {
    return {
      label: decodeUrlString(item),
      value: item,
      link: `/${item}?map=ft`,
    }
  })

  return result
}

const HISTORY_KEY = 'biggy-search-history'

/**
 * Get the search history from cookies
 */
export const searchHistory = () => {
  const history = getCookie(HISTORY_KEY) ?? ''

  return history.split(',').filter(x => !!x)
}

/**
 * Add terms to the search history
 */
export const prependSearchHistory = (term: string, limit = 5) => {
  if (term == null || term.trim() === '') {
    return
  }

  let history = searchHistory()

  if (history.indexOf(term) < 0) {
    history.unshift(term)
    history = history.slice(0, limit)
  }

  setCookie(HISTORY_KEY, history.join(','))
}
