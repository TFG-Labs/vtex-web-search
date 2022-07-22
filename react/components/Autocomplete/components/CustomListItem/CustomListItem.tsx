/* eslint-disable jsx-a11y/alt-text */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'

import styles from './styles.css'

interface CustomListItemProps {
  product: Product
  onClick: () => void
}

const CustomListItem: FC<CustomListItemProps> = ({ product, onClick }) => {
  const sku = product?.sku

  return (
    <div>
      <Link
        params={{
          slug: product?.linkText,
          id: product?.productId,
        }}
        page="store.product"
        className="no-underline"
        onClick={onClick}
      >
        <article
          className={`${styles.element} flex flex-row justify-start items-center pa3 bg-animate hover-bg-light-gray`}
        >
          <div className={`${styles.imageContainer} h3`}>
            <img
              className={`${styles.image} h-100 w-auto mw-none`}
              src={sku?.image?.imageUrl}
            />
          </div>
          <div
            className={`${styles.information} flex flex-column justify-between items-start ml4`}
          >
            <div className={styles.productNameContainer}>
              <span className={`${styles.productBrand} f5 c-on-base`}>
                {product.productName}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}

export default CustomListItem
