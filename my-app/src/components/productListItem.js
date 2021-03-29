import React from 'react';



function ProductListItem(props) {

    return (
        <div className="productListItem">
            <div>{props.product.name}</div>
            <div className="productInfo">
                <p>Cat.N:{props.product.catalog_number}</p>
                <p>House:{props.product.trading_house}</p>
                <p>Ref:{props.product.reference_number}</p>
                <p>Price:{props.product.price}</p>
            </div>
        </div>
    )
}

export default ProductListItem