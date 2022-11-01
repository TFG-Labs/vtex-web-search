import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import suggestionProducts from 'vtex.store-resources/QuerySuggestionProducts'
import suggestionSearches from 'vtex.store-resources/QueryAutocompleteSearchSuggestions'

import { ISearchProduct } from '../components/search-product'

export default class BiggyClient {
  constructor(private client: ApolloClient<any>) {}

  public async suggestionSearches(
    term: string
  ): Promise<
    ApolloQueryResult<{ autocompleteSearchSuggestions: ISearchesOutput }>
  > {
    return this.client.query({
      query: suggestionSearches,
      variables: {
        fullText: term,
      },
    })
  }

  // eslint-disable-next-line max-params
  public async suggestionProducts(
    term: string,

    count?: number
  ): Promise<ApolloQueryResult<{ productSuggestions: IProductsOutput }>> {
    return this.client.query({
      query: suggestionProducts,
      variables: {
        simulationBehavior: 'default',
        hideUnavailableItems: true,
        orderBy: 'OrderByScoreDESC',
        fullText: term,
        productOriginVtex: false,
        count,
      },
      fetchPolicy: 'network-only',
    })
  }
}

interface ISearchesOutput {
  searches: ISuggestionQueryResponseSearch[]
}

interface IProductsOutput {
  products: ISearchProduct[]
  count: number
  misspelled: boolean
  operator: string
}

export interface ISuggestionQueryResponseSearch {
  term: string
  count: number
  attributes: IElasticProductText[]
}

interface IElasticProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}

export interface IElasticProductInstallment {
  count: number
  value: number
  interest: boolean
  valueText: string
}

interface IElasticProductText {
  key: string
  value: string
  labelKey: string
  labelValue: string
}
