import React, { FC } from 'react'
import { Spinner } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import styles from './styles.css'
import CustomListItem from '../CustomListItem/CustomListItem'
import SeeMoreButton from '../SeeMoreButton'

interface TileListProps {
  term: string
  title: string | JSX.Element
  products: any[]
  shelfProductCount: number
  totalProducts: number
  isLoading: boolean
  onProductClick: (product: string, position: number) => void
  onSeeAllClick: (term: string) => void
}

const TileList: FC<TileListProps> = ({
  term,
  title,
  products,
  totalProducts,
  isLoading,
  onProductClick,
  onSeeAllClick,
}) => {
  if (products.length === 0 && !isLoading) {
    return null
  }

  return (
    <section className={styles.tileList}>
      <p className={` c-on-base`}>{title}</p>
      {isLoading ? (
        <div className={styles.tileListSpinner}>
          <Spinner />
        </div>
      ) : (
        <>
          <ul
            className={styles.tileListList}
            style={{
              flexDirection: 'column',
            }}
          >
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

          {totalProducts > 0 && (
            <SeeMoreButton
              term={term}
              onSeeAllClick={onSeeAllClick}
              totalProducts={totalProducts}
            />
          )}
        </>
      )}
    </section>
  )
}

export default TileList
