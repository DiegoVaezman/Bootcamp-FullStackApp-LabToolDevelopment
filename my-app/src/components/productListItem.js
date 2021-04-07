import React from 'react';
import { Link } from 'react-router-dom'


function ProductListItem(props) {

    return (
        <Link className="txtNoDeco" to={{pathname:`/products/productsheet/${props.product._id}`, data:props}} >
            <div className="productListItem" product={props}>
                    <div className="productName"><p>{props.product.name}</p></div>
                    <div className="productInfo">
                        <p><b>Cat.N: </b>{props.product.catalog_number}</p>
                        <p><b>House: </b>{props.product.trading_house}</p>
                        <p><b>Ref: </b>{props.product.reference_number}</p>
                        <p><b>Price: </b>{props.product.price}€</p>
                    </div>
            </div>
         </Link>
    )
}

export default ProductListItem