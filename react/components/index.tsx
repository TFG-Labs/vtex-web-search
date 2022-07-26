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
import SuggestionSection from './SuggestionSection'
import { withRuntime } from '../utils/withRuntime'

import {
  EventType,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../utils/pixel'
import SeeMoreButton from './Autocomplete/components/SeeMoreButton'
import SearchHistory from './SearchHistory'
import { addTermToHistory, transformSearchSuggestions } from './utils'
import { AutoCompleteProps, AutoCompleteState } from './types'

const MAX_SUGGESTED_PRODUCTS = 5

const { ProductListProvider } = ProductListContext

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  client: BiggyClient

  public readonly state: AutoCompleteState = {
    products: [],
    suggestionItems: [],
    dynamicTerm: '',
    isProductsLoading: false,
  }

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props)

    this.client = new BiggyClient(this.props.client)
  }

  closeModal() {
    if (this.props.closeMenu) {
      this.props.closeMenu()
    }
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (prevProps.inputValue === this.props.inputValue) return

    addTermToHistory()

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
    })
  }

  contentWhenQueryIsNotEmpty() {
    const { products, isProductsLoading } = this.state
    const { push, runtime, inputValue } = this.props

    return (
      <>
        <SeeMoreButton
          inputValue={inputValue}
          onSeeAllClick={term => {
            handleSeeAllClick(push, runtime.page)(term)
            this.closeModal()
          }}
        />

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
          inputValue={inputValue}
          products={products || []}
          isLoading={isProductsLoading}
          onProductClick={(id, position) => {
            handleProductClick(push, runtime.page)(id, position)
            this.closeModal()
          }}
        />
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
