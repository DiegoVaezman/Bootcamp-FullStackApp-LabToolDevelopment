import React from 'react';
import './signup.css'

function SignupPage(props) {
    console.log(props.name)
    return (
        <div className="signupPage">
            <p>ESTA ES LA PAGINA DE SIGN UP anidada {props.name}</p>
            <form>
                <input type="text"></input>
            </form>
        </div>
    )
}

export default SignupPage