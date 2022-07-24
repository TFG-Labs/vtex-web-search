import React, { FC } from 'react'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import CustomListItem from '../CustomListItem/CustomListItem'

interface TileListProps {
  title: string
  products: any[]
  isLoading: boolean
  onProductClick: (product: string, position: number) => void
}

const TileList: FC<TileListProps> = ({
  title,
  products,

  isLoading,
  onProductClick,
}) => {
  if (products.length === 0 && !isLoading) {
    return null
  }

  return (
    <section>
      <p>{title}</p>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}

export default TileList
