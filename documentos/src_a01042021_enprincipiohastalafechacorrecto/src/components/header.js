import React from 'react';
import {Link, Redirect} from 'react-router-dom'

function Header(props) {



    
    console.log(props)
    return (
        <Link to="/user" className="header">
            <div >
                <p>LOGO Darwin Lab</p>
                <p>{"props.user.data.fullname"}</p>
            </div>
        </Link>
    )
}

export default Header