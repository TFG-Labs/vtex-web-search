/* eslint-disable jsx-a11y/alt-text */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'

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
        <div>
          <img src={sku?.image?.imageUrl} />
          {product.productName}
        </div>
      </Link>
    </div>
  )
}

export default CustomListItem
