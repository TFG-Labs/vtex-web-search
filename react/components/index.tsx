// /* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { ProductListContext } from 'vtex.product-list-context'
import { withDevice } from 'vtex.device-detector'
import { withPixel } from 'vtex.pixel-manager/PixelContext'

import BiggyClient from '../utils/biggy-client'
import ProductResults from './ProductResults'
import { Item } from './Autocomplete/components/SuggestionSection/types'
import SuggestionSection from './SuggestionSection'
import { withRuntime } from '../utils/withRuntime'
import { encodeUrlString } from '../utils/string-utils'
import {
  EventType,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../utils/pixel'
import SeeMoreButton from './Autocomplete/components/SeeMoreButton'
import SearchHistory from './SearchHistory'
import { prependSearchHistory, transformSearchSuggestions } from './utils'

const MAX_SUGGESTED_PRODUCTS = 5

interface AutoCompleteProps {
  runtime: { page: string }
  inputValue: string
  push: (data: any) => void
  closeMenu: () => void
}

interface AutoCompleteState {
  suggestionItems: Item[]
  products: any[]
  totalProducts: number
  dynamicTerm: string
  isProductsLoading: boolean
}

const { ProductListProvider } = ProductListContext

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  client: BiggyClient

  public readonly state: AutoCompleteState = {
    products: [],
    suggestionItems: [],
    totalProducts: 0,

    dynamicTerm: '',
    isProductsLoading: false,
  }

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props)

    this.client = new BiggyClient(this.props.client)
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return prevProps.inputValue !== this.props.inputValue
  }

  addTermToHistory() {
    const path = window.location.href.split('_q=')

    if (path[1]) {
      const term = path[1].split('&')[0]

      try {
        prependSearchHistory(decodeURI(term))
      } catch {
        prependSearchHistory(term)
      }
    }
  }

  closeModal() {
    if (this.props.closeMenu) {
      this.props.closeMenu()
    }
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (!this.shouldUpdate(prevProps)) {
      return
    }

    this.addTermToHistory()

    const { inputValue } = this.props

    this.setState({
      dynamicTerm: inputValue,
    })

    if (inputValue === null || inputValue === '') {
      this.setState({
        suggestionItems: [],
        products: [],
      })
    } else {
      this.updateSuggestions().then(() => {
        return this.updateProducts()
      })
    }
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(this.props.inputValue)
    const { searches } = result.data.autocompleteSearchSuggestions

    const query = this.props.inputValue.toLocaleLowerCase()

    const suggestionItems = transformSearchSuggestions(searches, query)

    this.setState({ suggestionItems })
  }

  async updateProducts() {
    const term = this.state.dynamicTerm

    if (!term) {
      this.setState({
        products: [],
        totalProducts: 0,
      })

      return
    }

    this.setState({
      isProductsLoading: true,
    })

    const result = await this.client.suggestionProducts(
      term,
      MAX_SUGGESTED_PRODUCTS
    )

    this.setState({
      isProductsLoading: false,
    })

    const { productSuggestions } = result.data

    const products = productSuggestions.products.slice(
      0,
      MAX_SUGGESTED_PRODUCTS
    )

    this.setState({
      products,
      totalProducts: productSuggestions.count,
    })
  }

  contentWhenQueryIsNotEmpty() {
    const { products, totalProducts, isProductsLoading } = this.state
    const { push, runtime, inputValue } = this.props

    return (
      <>
        <SuggestionSection
          items={this.state.suggestionItems || []}
          onItemClick={(value: string, position: number) => {
            handleItemClick(
              this.props.push,
              this.props.runtime.page,
              EventType.SearchSuggestionClick
            )(value, position)
            this.closeModal()
          }}
          closeModal={() => this.closeModal()}
        />
        <ProductResults
          products={products || []}
          isLoading={isProductsLoading}
          onProductClick={(id, position) => {
            handleProductClick(push, runtime.page)(id, position)
            this.closeModal()
          }}
        />

        {totalProducts > 0 && (
          <SeeMoreButton
            term={encodeUrlString(inputValue) || ''}
            onSeeAllClick={term => {
              handleSeeAllClick(push, runtime.page)(term)
              this.closeModal()
            }}
            totalProducts={totalProducts || 0}
          />
        )}
      </>
    )
  }

  render() {
    const query = this.props.inputValue.trim()
    const hasQuery = query && query !== ''

    return (
      <section style={{ width: '500px', backgroundColor: 'white' }}>
        <ProductListProvider listName="autocomplete-result-list">
          {hasQuery ? (
            this.contentWhenQueryIsNotEmpty()
          ) : (
            <SearchHistory
              onItemClick={(value, position) => {
                handleItemClick(
                  this.props.push,
                  this.props.runtime.page,
                  EventType.HistoryClick
                )(value, position)
                this.closeModal()
              }}
            />
          )}
        </ProductListProvider>
      </section>
    )
  }
}

export default withPixel(withDevice(withApollo(withRuntime(AutoComplete))))
