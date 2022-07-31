import React, { FC } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { highlightTerm } from './utils'
import HorizontalRule from './HorizontalRule'
import { ISearchProduct } from '../models/search-product'

interface ProductResultsProps {
  products: ISearchProduct[]

  onProductClick: (product: string, position: number) => void
  inputValue: string
}

const CSS_HANDLES = [
  'productResultsWrapper',
  'productResultImage',
  'productResultName',
  'productResultLink',
  'productResultHighlightedTerm',
] as const

const ProductResults: FC<ProductResultsProps> = ({
  products,
  onProductClick,
  inputValue,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  if (!products.length) return null

  const productSummaryItems: Product[] = products.map(product =>
    ProductSummary.mapCatalogProductToProductSummary(
      product,
      'FIRST_AVAILABLE',
      80
    )
  )

  return (
    <section>
      <HorizontalRule />
      {productSummaryItems.map((product, index) => (
        <Link
          key={index}
          params={{
            slug: product?.linkText,
            id: product?.productId,
          }}
          page="store.product"
          className={handles.productResultLink}
          onClick={() => {
            onProductClick(product.productId, index)
          }}
        >
          <img
            className={handles.productResultImage}
            src={product?.sku?.image?.imageUrl}
            alt={product?.sku?.image?.imageLabel ?? ''}
          />
          <p className={handles.productResultName}>
            {highlightTerm(
              product.productName,
              inputValue,
              handles.productResultHighlightedTerm
            )}
          </p>
        </Link>
      ))}
    </section>
  )
}

export default ProductResults
