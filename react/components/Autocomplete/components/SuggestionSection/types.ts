export interface Item {
  label: string | JSX.Element
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
