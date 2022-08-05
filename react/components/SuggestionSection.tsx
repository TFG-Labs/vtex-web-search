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

  if (item?.attributes && item?.attributes.length > 0) return null

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
  const { handles } = useCssHandles(CSS_HANDLES)
  const { item } = props

  if (!item?.attributes || item?.attributes.length === 0) return null

  const itemsElements = item.attributes.map((attribute, index) => {
    return (
      <li key={index}>
        <Link
          className={handles.suggestionSectionLink}
          to={`/${props.item.value}/${attribute.value}`}
          query={`map=ft,${attribute.key}`}
          onClick={() => props.closeModal()}
        >
          {' '}
          <span>
            {attribute.label} {item.label}
          </span>
        </Link>
      </li>
    )
  })

  return <>{itemsElements}</>
}

const SuggestionSection: FC<SuggestionSectionProps> = props => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const { items } = props

  return (
    <article className={handles.suggestionSectionWrapper}>
      {items.length > 0 && <HorizontalRule />}
      <ol className={handles.suggestionSectionOl}>
        {items.map((item, index) => {
          return (
            <React.Fragment key={item.value}>
              <li className={handles.suggestionSectionLi}>
                <SuggestionLink
                  item={item}
                  onItemClick={props.onItemClick}
                  position={index}
                />
              </li>
              <AtrributeLinks item={item} closeModal={props.closeModal} />
            </React.Fragment>
          )
        })}
      </ol>
    </article>
  )
}

export default SuggestionSection
