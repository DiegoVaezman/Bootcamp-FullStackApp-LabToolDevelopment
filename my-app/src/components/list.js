import React from 'react';
import './productList.css'
import ProductListItem from './productListItem'


function List(props) {
    

    return (
        <div className="list">
            {props.data.map((item, index) => {
                if (props.section === "products") {
                return <ProductListItem product={item} />
                }
                // if (props.section === "requests") {
                //     return <RequestListItem request={item} />
                // }
                // if (props.section === "stock") {
                //     return <StockListItem item={item} />
                // }
            })}
        </div>
    )
}

export default List