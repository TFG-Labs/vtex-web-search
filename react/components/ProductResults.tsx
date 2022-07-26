import React, { FC } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { highlightTerm } from './utils'

interface ProductResultsProps {
  products: any[]
  isLoading: boolean
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
  isLoading,
  onProductClick,
  inputValue,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  if (!products.length && !isLoading) return null
  if (isLoading) return <div>loader</div>

  const productSummaryItems: Product[] = products.map(product =>
    ProductSummary.mapCatalogProductToProductSummary(product)
  )

  return (
    <section>
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
