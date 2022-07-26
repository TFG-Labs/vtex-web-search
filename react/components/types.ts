import { Item } from './Autocomplete/components/SuggestionSection/types'

export interface AutoCompleteState {
  suggestionItems: Item[]
  products: any[]
  dynamicTerm: string
  isProductsLoading: boolean
}

export interface AutoCompleteProps {
  runtime: { page: string }
  inputValue: string
  push: (data: any) => void
  closeMenu: () => void
}
