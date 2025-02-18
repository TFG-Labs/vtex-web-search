import { ISearchProduct } from '../models/search-product'

export interface AutoCompleteState {
  suggestionItems: Item[]
  products: ISearchProduct[]
  loading: boolean
}

export interface AutoCompleteProps {
  runtime: { page: string }
  inputValue: string
  push: (data: any) => void
  closeMenu: () => void
  isOpen: boolean
}

export interface Item {
  label: string
  value: string
  link: string
  attributes?: AttributeItem[]
}

export interface AttributeItem {
  groupValue: string
  value: string
  label: string
  link: string
  key: string
}
