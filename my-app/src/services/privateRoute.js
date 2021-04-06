import React from 'react';
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute({children, ...rest}) {
    return (
        <Route 
            {...rest}
            render={({ location }) => 
                localStorage.getItem("labToolUser") ? (children) : 
                (<Redirect to={{pathname: "/signin"}} />)
            }
        />
    );
}

export default PrivateRoute