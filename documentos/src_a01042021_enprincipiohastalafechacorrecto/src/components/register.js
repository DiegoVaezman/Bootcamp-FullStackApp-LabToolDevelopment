import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

function Register() {
    return (
        <div className="register">
            <div className="img"><img src="../../img/LabTool_logo.png" alt="LabTool_logo"/></div>
            <Link to="/signup"className="sign_button signup"><p>SIGN UP</p></Link>
            <Link to="/signin" className="sign_button signin"><p>SIGN IN</p></Link>
        </div>

    )
}

export default Register