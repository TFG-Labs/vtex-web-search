/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'

import { Item } from './Autocomplete/components/SuggestionSection/types'
import Attribute from './Autocomplete/components/SuggestionSection/Attribute'

interface SuggestionSectionProps {
  items: Item[]
  onItemClick: (term: string, position: number) => void
  closeModal: () => void
}

const SuggestionSection: FC<SuggestionSectionProps> = props => {
  const { items } = props

  return (
    <article>
      <p>Suggestionss</p>
      <hr />
      <ol>
        {items.map((item, index) => {
          return (
            <li key={item.value}>
              <Link
                page="store.search"
                params={{
                  term: item.value,
                }}
                query={`map=ft&_q=${item.value}`}
                onClick={() => props.onItemClick(item.value, index)}
              >
                <span>{item.label}</span>
              </Link>
              <Attribute item={item} closeModal={props.closeModal} />
            </li>
          )
        })}
      </ol>
    </article>
  )
}
export default SuggestionSection
