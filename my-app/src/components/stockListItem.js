import React from 'react';
import { Link } from 'react-router-dom'


function StockListItem(props) {

   console.log(props)
    return (
        <Link to={{pathname:`/stock/itemsheet/${props.item._id}`, data:props}} >
            <div className="productListItem" >
                    <div>{"nombre del producto enlazado el item"}</div>
                    <div className="productInfo">
                        {props.item.status === "In stock" ? <p style={{color: "green"}}>{props.item.status}</p> : <p style={{color: "red"}}>{props.item.status}</p>}
                        {props.item.limit === true && <p>Limit controled</p>}
                        {props.item.request === true && <p style={{color: "orange"}}>Currently ordered</p>}
                    </div>
                    <div>{props.item.amount}</div>
            </div>
         </Link>
    )
}

export default StockListItem