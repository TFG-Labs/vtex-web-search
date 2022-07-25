import React, { FC } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { Link } from 'vtex.render-runtime'

interface ProductResultsProps {
  products: any[]
  isLoading: boolean
  onProductClick: (product: string, position: number) => void
}

const ProductResults: FC<ProductResultsProps> = ({
  products,
  isLoading,
  onProductClick,
}) => {
  if (!products.length && !isLoading) return null
  if (isLoading) return <div>loader</div>

  const productSummaryItems: Product[] = products.map(product =>
    ProductSummary.mapCatalogProductToProductSummary(product)
  )

  return (
    <section>
      <ul>
        {productSummaryItems.map((product, index: number) => (
          <Link
            key={index}
            params={{
              slug: product?.linkText,
              id: product?.productId,
            }}
            page="store.product"
            className="no-underline"
            onClick={() => {
              onProductClick(product.productId, index)
            }}
          >
            <div>
              <img
                src={product?.sku?.image?.imageUrl}
                alt={product?.sku?.image?.imageLabel ?? ''}
              />
              {product.productName}
            </div>
          </Link>
        ))}
      </ul>
    </section>
  )
}

export default ProductResults
