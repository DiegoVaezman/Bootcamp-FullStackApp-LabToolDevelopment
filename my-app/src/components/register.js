import React from 'react';
import {Link} from 'react-router-dom'
import Contact from './contact'

function Register() {
    return (
        <div className="register app grid">
            <div className="registerLogo"><img src="../../img/LabTool_logo.png" alt="LabTool_logo"/></div>
            <Link to="/signup"className="button1 signupButtonRegister"><p>SIGN UP</p></Link>
            <Link to="/signin" className="button1 signinButtonRegister"><p>SIGN IN</p></Link>
            <Contact />
        </div>

    )
}

export default Register