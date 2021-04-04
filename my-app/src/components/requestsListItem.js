import React from 'react';
import { Link } from 'react-router-dom'


function RequestsListItem(props) {

    // const commentsCount = (count) => {
    //     console.log(count)
    //     return count
    // }
    return (
        <Link to={{pathname:`/requests/requestsheet/${props.order._id}`, data:props}} >
            <div className="productListItem" >
                
                    <div>
                    <div>{props.order.name}</div>
                    <div>
                    <img className="img comentario"></img>
                    <p>{}</p>
                    </div>
                    </div>
                    <div className="productInfo">
                        <p>Amount: {props.order.amount} units</p>
                        <p>User:{"ordennte"}</p>
                        <p>Date:{props.order.date.substring(0,10)}</p>
                        {(props.order.status === "waiting") && <p style={{color: "orange"}}>{props.order.status}</p>}
                        {(props.order.status === "validated") && <p style={{color: "green"}}>{props.order.status}</p>}
                        {(props.order.status === "received") && <p style={{color: "blue"}}>{props.order.status}</p>}
                        {(props.order.status === "rejected") && <p style={{color: "red"}}>{props.order.status}</p>}
                    </div>
            
            </div>
         </Link>
    )
}

export default RequestsListItem