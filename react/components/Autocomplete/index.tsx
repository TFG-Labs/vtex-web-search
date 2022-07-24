// /* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { IconClock } from 'vtex.styleguide'
import { ProductListContext } from 'vtex.product-list-context'
import { withDevice } from 'vtex.device-detector'
import debounce from 'debounce'
import { withPixel } from 'vtex.pixel-manager/PixelContext'

import BiggyClient from '../../utils/biggy-client'
import TileList from './components/TileList/TileList'
import { Item } from './components/ItemList/types'
import { ItemList } from './components/ItemList/ItemList'
import { withRuntime } from '../../utils/withRuntime'
import { decodeUrlString, encodeUrlString } from '../../utils/string-utils'
import {
  EventType,
  handleItemClick,
  handleProductClick,
  handleSeeAllClick,
} from '../../utils/pixel'
import SeeMoreButton from './components/SeeMoreButton'

const MAX_SUGGESTED_TERMS_DEFAULT = 9
const MAX_SUGGESTED_PRODUCTS = 5
const MAX_HISTORY_DEFAULT = 5

interface AutoCompleteProps {
  isOpen: boolean
  runtime: { page: string }
  inputValue: string
  push: (data: any) => void
  closeMenu: () => void
}

interface AutoCompleteState {
  suggestionItems: Item[]
  history: Item[]
  products: any[]
  totalProducts: number
  dynamicTerm: string
  isProductsLoading: boolean
  currentHeightWhenOpen: number
}

const { ProductListProvider } = ProductListContext

class AutoComplete extends React.Component<
  WithApolloClient<AutoCompleteProps>,
  Partial<AutoCompleteState>
> {
  autocompleteRef: React.RefObject<any>
  client: BiggyClient
  isIOS: boolean

  public readonly state: AutoCompleteState = {
    history: [],
    products: [],
    suggestionItems: [],
    totalProducts: 0,

    dynamicTerm: '',
    isProductsLoading: false,
    currentHeightWhenOpen: 0,
  }

  constructor(props: WithApolloClient<AutoCompleteProps>) {
    super(props)

    this.client = new BiggyClient(this.props.client)
    this.autocompleteRef = React.createRef()
    this.isIOS = navigator && !!navigator.userAgent.match(/(iPod|iPhone|iPad)/)
  }

  fitAutocompleteInWindow() {
    if (!window || !this.autocompleteRef.current || this.isIOS) {
      return
    }

    const windowHeight = window.innerHeight
    const autocompletePosition = this.autocompleteRef.current.getBoundingClientRect()
      .y

    const autocompleteHeight = this.autocompleteRef.current.offsetHeight
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const autocompleteEnd = autocompletePosition + autocompleteHeight

    const currentHeight = autocompleteHeight - (autocompleteEnd - windowHeight)

    this.autocompleteRef.current.style.maxHeight = `${currentHeight}px`
  }

  addEvents() {
    window.addEventListener(
      'resize',
      debounce(this.fitAutocompleteInWindow.bind(this), 100)
    )
  }

  componentDidMount() {
    this.updateHistory()
    this.addEvents()
  }

  shouldUpdate(prevProps: AutoCompleteProps) {
    return (
      prevProps.inputValue !== this.props.inputValue ||
      (!prevProps.isOpen && this.props.isOpen)
    )
  }

  addTermToHistory() {
    const path = window.location.href.split('_q=')

    if (path[1]) {
      const term = path[1].split('&')[0]

      try {
        return this.client.prependSearchHistory(decodeURI(term))
      } catch {
        return this.client.prependSearchHistory(term)
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
    this.fitAutocompleteInWindow()

    const { inputValue } = this.props

    this.setState({
      dynamicTerm: inputValue,
    })

    if (inputValue === null || inputValue === '') {
      this.updateHistory()

      this.setState({
        suggestionItems: [],
        products: [],
      })
    } else {
      this.updateSuggestions()
        .then(() => {
          this.fitAutocompleteInWindow()

          return this.updateProducts()
        })
        .then(() => this.fitAutocompleteInWindow())
    }
  }

  highlightTerm(label: string, query: string) {
    const splittedLabel = label.split(query)

    return (
      <>
        {splittedLabel.map((str: string, index: number) => {
          return (
            <>
              {str}
              {index !== splittedLabel.length - 1 ? (
                <span className="b">{query}</span>
              ) : null}
            </>
          )
        })}
      </>
    )
  }

  async updateSuggestions() {
    const result = await this.client.suggestionSearches(this.props.inputValue)
    const { searches } = result.data.autocompleteSearchSuggestions

    const items = searches.slice(0, MAX_SUGGESTED_TERMS_DEFAULT).map(query => {
      const attributes = query.attributes || []

      return {
        term: query.term,
        attributes: attributes.map(att => ({
          label: att.labelValue,
          value: att.value,
          link: `/${query.term}/${att.value}/?map=ft,${att.key}`,
          groupValue: query.term,
          key: att.key,
        })),
      }
    })

    const suggestionItems: Item[] = items.map(suggestion => ({
      label: this.highlightTerm(
        suggestion.term.toLowerCase(),
        this.props.inputValue.toLocaleLowerCase()
      ),
      value: suggestion.term,
      groupValue: suggestion.term,
      link: `/${suggestion.term}?map=ft`,
      attributes: suggestion.attributes,
    }))

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

  updateHistory() {
    const history = this.client
      .searchHistory()
      .slice(0, MAX_HISTORY_DEFAULT)
      .map((item: string) => {
        return {
          label: decodeUrlString(item),
          value: item,
          link: `/${item}?map=ft`,
          icon: <IconClock />,
        }
      })

    this.setState({
      history,
    })
  }

  renderSuggestions() {
    const hasSuggestion =
      !!this.state.suggestionItems && this.state.suggestionItems.length > 0

    const titleMessage = hasSuggestion ? 'Suggestions' : 'No Suggestions'

    return (
      <ItemList
        title={titleMessage}
        items={this.state.suggestionItems || []}
        showTitle={!hasSuggestion}
        onItemClick={(value, position) => {
          handleItemClick(
            this.props.push,
            this.props.runtime.page,
            EventType.SearchSuggestionClick
          )(value, position)
          this.closeModal()
        }}
        closeModal={() => this.closeModal()}
      />
    )
  }

  contentWhenQueryIsEmpty() {
    return (
      <ItemList
        title="Search History"
        items={this.state.history || []}
        showTitle
        onItemClick={(value, position) => {
          handleItemClick(
            this.props.push,
            this.props.runtime.page,
            EventType.HistoryClick
          )(value, position)
          this.closeModal()
        }}
        closeModal={() => this.closeModal()}
      />
    )
  }

  contentWhenQueryIsNotEmpty() {
    const { products, totalProducts, isProductsLoading } = this.state
    const { push, runtime, inputValue } = this.props
    const inputValueEncoded = encodeUrlString(inputValue)

    return (
      <>
        {this.renderSuggestions()}
        <TileList
          title={`Products for ${inputValue}`}
          products={products || []}
          isLoading={isProductsLoading}
          onProductClick={(id, position) => {
            handleProductClick(push, runtime.page)(id, position)
            this.closeModal()
          }}
        />

        {totalProducts > 0 && (
          <SeeMoreButton
            term={inputValueEncoded || ''}
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

  renderContent() {
    const query = this.props.inputValue.trim()

    return query && query !== ''
      ? this.contentWhenQueryIsNotEmpty()
      : this.contentWhenQueryIsEmpty()
  }

  render() {
    return (
      <section ref={this.autocompleteRef}>
        <ProductListProvider listName="autocomplete-result-list">
          {this.renderContent()}
        </ProductListProvider>
      </section>
    )
  }
}

export default withPixel(withDevice(withApollo(withRuntime(AutoComplete))))
