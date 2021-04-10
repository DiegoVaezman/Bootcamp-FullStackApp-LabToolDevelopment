import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

function Register() {
    return (
        <div className="register app grid">
            <div className="registerLogo"><img src="../../img/LabTool_logo.png" alt="LabTool_logo"/></div>
            <Link to="/signup"className="button1 signupButtonRegister"><p>SIGN UP</p></Link>
            <Link to="/signin" className="button1 signinButtonRegister"><p>SIGN IN</p></Link>
        </div>

    )
}

export default Register