/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item } from './types'
import Attribute from './Attribute'

interface ItemListProps {
  title: string | JSX.Element
  items: Item[]
  showTitle: boolean
  onItemClick: (term: string, position: number) => void
  showTitleOnEmpty?: boolean
  closeModal: () => void
}

export class ItemList extends React.Component<ItemListProps> {
  render() {
    if (this.props.items.length === 0 && !this.props.showTitleOnEmpty) {
      return null
    }

    return (
      <article>
        {this.props.showTitle ? <p>{this.props.title}</p> : null}
        <ol>
          {this.props.items.map((item, index) => {
            return (
              <li key={item.value}>
                <Link
                  page="store.search"
                  params={{
                    term: item.value,
                  }}
                  query={`map=ft&_q=${item.value}`}
                  onClick={() => this.props.onItemClick(item.value, index)}
                >
                  {item.prefix ? <span>{item.prefix}</span> : null}

                  <span>{item.label}</span>
                </Link>
                <Attribute item={item} closeModal={this.props.closeModal} />
              </li>
            )
          })}
        </ol>
      </article>
    )
  }
}
