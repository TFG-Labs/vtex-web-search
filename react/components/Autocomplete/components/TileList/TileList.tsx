import React, { FC } from 'react'
import { Spinner } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import styles from './styles.css'
import CustomListItem from '../CustomListItem/CustomListItem'
import { ProductLayout } from '../..'
import SeeMoreButton from '../SeeMoreButton'

interface TileListProps {
  term: string
  title: string | JSX.Element
  products: any[]
  showTitle: boolean
  shelfProductCount: number
  totalProducts: number
  layout: ProductLayout
  isLoading: boolean
  onProductClick: (product: string, position: number) => void
  onSeeAllClick: (term: string) => void
  HorizontalProductSummary?: React.ComponentType<{
    product: Product
    actionOnClick: () => void
  }>
}

const TileList: FC<TileListProps> = ({
  term,
  title,
  products,
  showTitle,
  totalProducts,
  isLoading,
  onProductClick,
  onSeeAllClick,
  HorizontalProductSummary,
}) => {
  if (products.length === 0 && !isLoading) {
    return null
  }

  return (
    <section className={styles.tileList}>
      {showTitle ? (
        <p className={`${styles.tileListTitle} c-on-base`}>{title}</p>
      ) : null}
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
                <li key={product.productId} className={styles.tileListItem}>
                  {HorizontalProductSummary ? (
                    <HorizontalProductSummary
                      product={productSummary}
                      actionOnClick={() => {
                        onProductClick(productSummary.productId, index)
                      }}
                    />
                  ) : (
                    <CustomListItem
                      product={productSummary}
                      onClick={() => {
                        onProductClick(productSummary.productId, index)
                      }}
                    />
                  )}
                </li>
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
