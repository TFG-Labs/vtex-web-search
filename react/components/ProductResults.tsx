import React, { FC } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import CustomListItem from './CustomListItem'

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
  if (isLoading) return <div>loading</div>

  console.log('raw products', products)
  return (
    <section>
      <ul>
        {products.map((product, index: number) => {
          const productSummary: Product = ProductSummary.mapCatalogProductToProductSummary(
            product
          )

          return (
            <CustomListItem
              key={product.productId}
              product={productSummary}
              onClick={() => {
                onProductClick(productSummary.productId, index)
              }}
            />
          )
        })}
      </ul>
    </section>
  )
}

export default ProductResults
