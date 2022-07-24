import React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item } from './types'

interface IAttributeProps {
  item: Item
  closeModal: () => void
}

const Attribute = (props: IAttributeProps) =>
  props.item?.attributes ? (
    <ul>
      {props.item.attributes.map((attribute, index) => (
        <li key={index}>
          <Link
            to={`/${props.item.value}/${attribute.value}`}
            query={`map=ft,${attribute.key}`}
            onClick={() => props.closeModal()}
          >
            {attribute.label}
          </Link>
        </li>
      ))}
    </ul>
  ) : null

export default Attribute
