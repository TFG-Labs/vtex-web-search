/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item, AttributeItem } from './types'
import Attribute from './Attribute'

interface ItemListProps {
  title: string | JSX.Element
  items: Item[]
  showTitle: boolean
  onItemClick: (term: string, position: number) => void
  modifier?: string
  onItemHover?: (item: Item | AttributeItem) => void
  showTitleOnEmpty?: boolean
  closeModal: () => void
}

interface ItemListState {
  currentTimeoutId: ReturnType<typeof setTimeout> | null
}

export class ItemList extends React.Component<ItemListProps> {
  public readonly state: ItemListState = {
    currentTimeoutId: null,
  }

  handleMouseOver = (e: React.MouseEvent | React.FocusEvent, item: Item) => {
    e.stopPropagation()

    const { currentTimeoutId } = this.state

    if (!currentTimeoutId) {
      const timeoutId = setTimeout(() => {
        this.props.onItemHover ? this.props.onItemHover(item) : null
        this.setState({ currentTimeoutId: null })
      }, 100)

      this.setState({ currentTimeoutId: timeoutId })
    }
  }

  handleMouseOut = () => {
    const { currentTimeoutId } = this.state

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
      this.setState({ currentTimeoutId: null })
    }
  }

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
              <li
                key={item.value}
                onMouseOver={e => this.handleMouseOver(e, item)}
                onFocus={e => this.handleMouseOver(e, item)}
                onMouseOut={() => this.handleMouseOut()}
                onBlur={() => this.handleMouseOut()}
              >
                <Link
                  page="store.search"
                  params={{
                    term: item.value,
                  }}
                  query={`map=ft&_q=${item.value}`}
                  onClick={() => this.props.onItemClick(item.value, index)}
                >
                  {item.icon ? <span>{item.icon}</span> : null}

                  {item.prefix ? <span>{item.prefix}</span> : null}

                  <span>{item.label}</span>
                </Link>
                <Attribute
                  item={item}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                  closeModal={this.props.closeModal}
                />
              </li>
            )
          })}
        </ol>
      </article>
    )
  }
}
