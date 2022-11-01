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
