import React from 'react'
import { ISuggestionQueryResponseSearch } from '../utils/biggy-client'
import { Item } from './Autocomplete/components/SuggestionSection/types'

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
