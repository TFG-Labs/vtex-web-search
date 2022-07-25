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

  console.log('raw products', products)
  return (
    <section>
      <ul>
        {products.map((product, index: number) => {
          const productSummary: Product = ProductSummary.mapCatalogProductToProductSummary(
            product
          )

          const sku = productSummary?.sku

          return (
            <Link
              key={index}
              params={{
                slug: productSummary?.linkText,
                id: productSummary?.productId,
              }}
              page="store.product"
              className="no-underline"
              onClick={() => {
                onProductClick(productSummary.productId, index)
              }}
            >
              <div>
                <img
                  src={sku?.image?.imageUrl}
                  alt={sku?.image?.imageLabel ?? ''}
                />
                {productSummary.productName}
              </div>
            </Link>
          )
        })}
      </ul>
    </section>
  )
}

export default ProductResults
