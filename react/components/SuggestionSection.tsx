/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Item } from './types'
import Attribute from './Attribute'
import HorizontalRule from './HorizontalRule'

interface SuggestionSectionProps {
  items: Item[]
  onItemClick: (term: string, position: number) => void
  closeModal: () => void
}

const CSS_HANDLES = [
  'suggestionSectionWrapper',
  'suggestionSectionOl',
  'suggestionSectionLi',
  'suggestionSectionLabel',
  'suggestionSectionLink',
] as const

const SuggestionSection: FC<SuggestionSectionProps> = props => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const { items } = props

  return (
    <article className={handles.suggestionSectionWrapper}>
      {items.length > 0 && <HorizontalRule />}
      <ol className={handles.suggestionSectionOl}>
        {items.map((item, index) => {
          return (
            <li key={item.value} className={handles.suggestionSectionLi}>
              <Link
                className={handles.suggestionSectionLink}
                page="store.search"
                params={{
                  term: item.value,
                }}
                query={`map=ft&_q=${item.value}`}
                onClick={() => props.onItemClick(item.value, index)}
              >
                <span>{item.label}</span>
              </Link>
              <Attribute
                key={item.value}
                item={item}
                closeModal={props.closeModal}
              />
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export default SuggestionSection
