import React from 'react';
import {Link, Redirect} from 'react-router-dom'

function Header() {
    return (
        <Link to="/user" className="header">
            <div >
                <p>LOGO Darwin Lab</p>
                <p>{JSON.parse(localStorage.getItem("labToolUser")).name}</p>
            </div>
        </Link>
    )
}

export default Header