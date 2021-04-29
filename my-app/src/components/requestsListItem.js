import React from 'react';
import { Link } from 'react-router-dom'

function RequestsListItem(props) {
    return (
        <Link className="txtNoDeco" to={{pathname:`/requests/requestsheet/${props.order._id}`, data:props}} >
            <div className="productListItem" >
                <div className="productListItemHead">
                    <div className="productName">
                        {(props.order.product != null) ? props.order.product.name : "No product"}
                    </div>
                    <div className="flex-row">
                        <p><b>{props.order.comments.length === 0 ? "0" : props.order.comments.length}</b></p>
                        <img alt="comment_img" className="commentImg" src="../../img/comment_img.png"></img>
                    </div>
                </div>
                <div className="productInfo">
                    <p><b>Amount: </b>{props.order.amount}</p>
                    <p>{(props.order.user != null) ? props.order.user.fullname : "No user"}</p>
                    <p>{props.order.date.substring(0,10).split('-').reverse().join('-')}</p>
                    <div ClassName="requestListItemStatus">
                        {(props.order.status === "waiting") && <p style={{color: "orange"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "validated") && <p style={{color: "green"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "received") && <p style={{color: "blue"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "rejected") && <p style={{color: "red"}}><b>{props.order.status}</b></p>}
                    </div>
                </div>
            </div>
         </Link>
    )
}

export default RequestsListItem