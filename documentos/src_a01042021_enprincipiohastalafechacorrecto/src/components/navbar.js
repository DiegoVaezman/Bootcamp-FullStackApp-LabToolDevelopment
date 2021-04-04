import React from 'react';
import {Link} from 'react-router-dom'

function Navbar() {
    return (
        <div className="nav">
            <Link to="/home">HOME</Link>
            <Link to="/products">PRODUCTS</Link>
            <Link to="/requests">REQUESTS</Link>
            <Link to="/stock">STOCK</Link>
        </div>
    )
}

export default Navbar