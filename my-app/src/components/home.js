import React from 'react';
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div>
            <Link to="/products">PRODUCTS</Link>
            <Link to="/requests">REQUESTS</Link>
            <Link to="/stock">STOCK</Link>
            <Link to="/user">USERS</Link>
        </div>
    )
}

export default Home