import React from 'react';
import {Link} from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar">
            <Link className="navbarLink" to="/home"><img src="../../img/home_img_white.png" alt="home_img"/></Link>
            <Link className="navbarLink" to="/products"><img src="../../img/searchProduct_img_white.png" alt="searchProduct_img"></img></Link>
            <Link className="navbarLink" to="/requests"><img src="../../img/request_img_white.png" alt="request_img"/></Link>
            <Link className="navbarLink" to="/stockitems"><img src="../../img/storage_img_white.png" alt="storage_img"/></Link>
        </div>
    )
}

export default Navbar