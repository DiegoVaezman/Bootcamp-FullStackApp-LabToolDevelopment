import React from 'react';
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div className="section ">
            <Link className="homeLink" to="/products">
                <img src="../../img/searchProduct_img.png" alt="searchProduct_img" />
                <div className="homeLink-name">PRODUCTS</div>
            </Link>
            <Link className="homeLink"  to="/requests">
                <img src="../../img/request_img.png" alt="request_img"/>
                <div className="homeLink-name">REQUESTS</div>
            </Link>
            <Link className="homeLink" to="/stockitems">
                <img src="../../img/storage_img.png" alt="storage_img"/>
                <div className="homeLink-name" >STOCK</div>
            </Link>
            <Link className="homeLink" to="/users">
                <img src="../../img/user_img.png" alt="user_img"/>
                <div className="homeLink-name" >USERS</div>
            </Link>
        </div>
    )
}

export default Home