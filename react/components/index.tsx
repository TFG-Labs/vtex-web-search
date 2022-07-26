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
// import SuggestionSection from './SuggestionSection'
import { withRuntime } from '../utils/withRuntime'

import {
  EventType,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../utils/pixel'
import SeeMoreButton from './Autocomplete/components/SeeMoreButton'
import SearchHistory from './SearchHistory'
import {
  addTermToHistory,
  // transformSearchSuggestions
} from './utils'
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
    loading: false,
  }

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props)

    this.client = new BiggyClient(this.props.client)
  }

  closeModal() {
    const { closeMenu } = this.props
    if (closeMenu) closeMenu()
  }

  componentDidUpdate(prevProps: AutoCompleteProps) {
    if (prevProps.inputValue === this.props.inputValue) return

    addTermToHistory()

    const { inputValue } = this.props

    if (inputValue === null || inputValue === '') {
      this.setState({
        suggestionItems: [],
        products: [],
      })
    } else {
      this.updateSuggestionsAndProductResult()
    }
  }

  async updateSuggestionsAndProductResult() {
    const { inputValue } = this.props

    this.setState({ loading: true })

    const res = await Promise.all([
      // will remove once this is investigated https://tfginfotec.atlassian.net/browse/TLF-1078
      // this.client.suggestionSearches(inputValue),
      this.client.suggestionProducts(inputValue, MAX_SUGGESTED_PRODUCTS),
    ])

    const [
      // will remove once this is investigated https://tfginfotec.atlassian.net/browse/TLF-1078
      // searchSuggestionResult,
      productSuggestionResult,
    ] = res
    const { products } = productSuggestionResult.data.productSuggestions
    // will remove once this is investigated https://tfginfotec.atlassian.net/browse/TLF-1078 ]
    // const {
    //   searches,
    // } = searchSuggestionResult.data.autocompleteSearchSuggestions

    this.setState({
      loading: false,
      // will remove once this is investigated https://tfginfotec.atlassian.net/browse/TLF-1078
      // suggestionItems: transformSearchSuggestions(
      //   searches,
      //   inputValue.toLocaleLowerCase()
      // ),
      products: products.slice(0, MAX_SUGGESTED_PRODUCTS),
    })
  }

  contentWhenQueryIsNotEmpty() {
    const { products } = this.state
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

        {/* will remove once this is investigated https://tfginfotec.atlassian.net/browse/TLF-1078 */}
        {/* <SuggestionSection
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
        /> */}
        <ProductResults
          inputValue={inputValue}
          products={products || []}
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
      //this is a class component and we are able to use cssHandles and need to target this
      <section className="thefoschini-search-2-x-topNavSearchResult">
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
