import React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item } from './types'

interface IAttributeProps {
  item: Item
  closeModal: () => void
}

const Attribute = (props: IAttributeProps) => {
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

export default Attribute
