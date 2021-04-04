import React from 'react';
import { Link } from 'react-router-dom'


function UserListItem(props) {
    console.log(props)
    return (
        <Link to={{pathname:`/user/usersheet/${props.user._id}`, data:props}} >
            <div className="productListItem" product={props}>
                
                    <div>{props.user.fullname}</div>
                    <div className="productInfo">
                        <p>Rol:{props.user.rol}</p>
                    </div>
            
            </div>
         </Link>
    )
}

export default UserListItem