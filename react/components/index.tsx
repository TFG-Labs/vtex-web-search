// /* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { ProductListContext } from 'vtex.product-list-context'
import { withPixel } from 'vtex.pixel-manager/PixelContext'
import BiggyClient from '../utils/biggy-client'
import ProductResults from './ProductResults'
import SuggestionSection from './SuggestionSection'
import { withRuntime } from '../utils/withRuntime'
import { Item } from './types'
import {
  EventType,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../utils/pixel'
import SeeMoreButton from './SeeMoreButton'
import SearchHistory from './SearchHistory'
import { addTermToHistory, transformSearchSuggestions } from './utils'
import { ISearchProduct } from './search-product'

const MAX_SUGGESTED_PRODUCTS = 5

const { ProductListProvider } = ProductListContext

interface AutoCompleteProps {
  runtime: { page: string }
  inputValue: string
  push: (data: any) => void
  closeMenu: () => void
  isOpen: boolean
}
interface AutoCompleteState {
  suggestionItems: Item[]
  products: ISearchProduct[]
  loading: boolean
}

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
      this.client.suggestionSearches(inputValue),
      this.client.suggestionProducts(inputValue, MAX_SUGGESTED_PRODUCTS),
    ])

    const [searchSuggestionResult, productSuggestionResult] = res
    const { products } = productSuggestionResult.data.productSuggestions

    const {
      searches,
    } = searchSuggestionResult.data.autocompleteSearchSuggestions

    this.setState({
      loading: false,
      suggestionItems: transformSearchSuggestions(
        searches,
        inputValue.toLocaleLowerCase()
      ),
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
          onProductClick={(id, position) => {
            handleProductClick(push, runtime.page)(id, position)
            this.closeModal()
          }}
        />
      </>
    )
  }

  render() {
    const { isOpen, inputValue } = this.props
    const query = inputValue.trim()
    const hasQuery = query && query !== ''

    return (
      //this is a class component and we are able to use cssHandles and need to target this
      <section
        className={`thefoschini-search-2-x-topNavSearchResult${
          isOpen ? '' : '--hidden'
        }`}
      >
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

export default withPixel(withApollo(withRuntime(AutoComplete)))
