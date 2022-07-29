/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Item } from './types'
import HorizontalRule from './HorizontalRule'

interface SuggestionLinkProps {
  item: Item
  onItemClick: (term: string, position: number) => void
  position: number
}
interface SuggestionSectionProps {
  items: Item[]
  onItemClick: (term: string, position: number) => void
  closeModal: () => void
}

interface AtrributeLinkProps {
  item: Item
  closeModal: () => void
}

const CSS_HANDLES = [
  'suggestionSectionWrapper',
  'suggestionSectionOl',
  'suggestionSectionLi',
  'suggestionSectionLabel',
  'suggestionSectionLink',
] as const

const SuggestionLink = (props: SuggestionLinkProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { item, onItemClick, position } = props

  return (
    <Link
      className={handles.suggestionSectionLink}
      page="store.search"
      params={{
        term: item.value,
      }}
      query={`map=ft&_q=${item.value}`}
      onClick={() => onItemClick(item.value, position)}
    >
      <span>{item.label}</span>
    </Link>
  )
}

const AtrributeLinks = (props: AtrributeLinkProps) => {
  const { item } = props

  if (!item?.attributes) return null

  return (
    <ul>
      {item.attributes.map((attribute, index) => (
        <li key={index}>
          <Link
            to={`/${props.item.value}/${attribute.value}`}
            query={`map=ft,${attribute.key}`}
            onClick={() => props.closeModal()}
          >
            {' '}
            <span>{attribute.label}</span> <span> &gt;</span>
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const SuggestionSection: FC<SuggestionSectionProps> = props => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const { items } = props

  return (
    <article className={handles.suggestionSectionWrapper}>
      {items.length > 0 && <HorizontalRule />}
      <ol className={handles.suggestionSectionOl}>
        {items.map((item, index) => {
          const showAttributeLink = item.attributes !== undefined

          return (
            <li key={item.value} className={handles.suggestionSectionLi}>
              {!showAttributeLink && (
                <SuggestionLink
                  item={item}
                  onItemClick={props.onItemClick}
                  position={index}
                />
              )}

              {showAttributeLink && (
                <AtrributeLinks
                  key={item.value}
                  item={item}
                  closeModal={props.closeModal}
                />
              )}
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export default SuggestionSection
