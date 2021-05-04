import React from 'react';
import { Link } from 'react-router-dom'

function UserListItem(props) {
    return (
        <Link className="txtNoDeco" to={{ pathname: `/users/usersheet/${props.user._id}`, data: props }} >
            <div className="productListItem" product={props}>
                <div className="productName">{props.user.fullname}</div>
                <div className="productInfo">
                    <p>{props.user.rol}</p>
                </div>
            </div>
        </Link>
    )
}

export default UserListItem