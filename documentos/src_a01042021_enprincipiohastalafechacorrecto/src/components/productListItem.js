import React from 'react';
import { Link } from 'react-router-dom'


function ProductListItem(props) {

    return (
        <Link to={{pathname:`/products/productsheet/${props.product._id}`, data:props}} onClick={localStorage.setItem('dataState', JSON.stringify(props.localState))}>
            <div className="productListItem" product={props}>
                
                    <div>{props.product.name}</div>
                    <div className="productInfo">
                        <p>Cat.N:{props.product.catalog_number}</p>
                        <p>House:{props.product.trading_house}</p>
                        <p>Ref:{props.product.reference_number}</p>
                        <p>Price:{props.product.price}€</p>
                    </div>
            
            </div>
         </Link>
    )
}

export default ProductListItem