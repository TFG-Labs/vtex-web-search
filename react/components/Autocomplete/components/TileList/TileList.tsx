import React, { FC } from 'react'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'

import styles from './styles.css'
import CustomListItem from '../CustomListItem/CustomListItem'
import { ProductLayout } from '../..'

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

interface SeeMoreButtonProps {
  term: string
  onSeeAllClick: (term: string) => void
  totalProducts: number
}
const SeeMoreButton = (props: SeeMoreButtonProps) => {
  const { term, totalProducts } = props

  // TODO Remove hard coding

  const stylesObj = {
    display: 'block',
    height: '60px',
    lineHeight: '60px',
    fontSize: '13px',
    color: '#787878',
    textAlign: 'center',
  }
  return (
    <Link
      query={`map=ft&_q=${props.term}`}
      params={{
        term,
      }}
      page="store.search"
      onClick={() => props.onSeeAllClick(term)}
      styles={stylesObj}
    >
      See all {totalProducts} productszzzzz
    </Link>
  )
}

const TileList: FC<TileListProps> = ({
  term,
  title,
  products,
  showTitle,
  totalProducts,
  layout,
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
              flexDirection:
                layout === ProductLayout.Horizontal ? 'column' : 'row',
            }}
          >
            {products.map((product, index: number) => {
              const productSummary: Product = ProductSummary.mapCatalogProductToProductSummary(
                product
              )

              return (
                <li key={product.productId} className={styles.tileListItem}>
                  {layout === ProductLayout.Horizontal ? (
                    HorizontalProductSummary ? (
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
                    )
                  ) : (
                    <ExtensionPoint
                      id="product-summary"
                      product={productSummary}
                      actionOnClick={() => {
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
