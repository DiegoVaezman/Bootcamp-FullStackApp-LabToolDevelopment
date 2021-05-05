import React, { useEffect } from 'react';
import { Link} from 'react-router-dom'
import axios from 'axios';
import { useState} from 'react';
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import setAuthToken from '../services/authToken'
import formatDate from '../services/formatDate'

function Signin(props) {

    // VENTANAS MODALES
    const responseModalRef = React.useRef();
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };

    //ESTADOS
    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })
    const [signinInputValue, setSigninInputValue] = useState({
        email: "",
        password: ""
    })

    //LOGUEANDO USUARIO
    const handleSigninInputChange = (event) => {
        setSigninInputValue({
            ...signinInputValue,
            [event.target.name]: event.target.value
        })
    }
    const login = (guest) => {
        let credentials = {...signinInputValue}
        if (guest === "guest") {
            credentials = {
                email: "guestuser@labtool.com",
                password: "1234567890"
            }}
        axios.post(`${apiURL}login/`, credentials)
            .then(res => {
                localStorage.removeItem('labToolUser')
                localStorage.setItem('labToolUser', res.data)
                // handleUserInfo({name: res.data.name, email: res.data.email, position: res.data.position, rol: res.data.rol, id: res.data.id})
                setAuthToken(res.data)
                setResponse({
                    ...response,
                    success: true,
                    msg: `Wellcome back!`
                })
                openResponseModal()
                userLogged()
                setSigninInputValue({
                    email: "",
                    password: ""
                })
            })
            .catch(error => {
                localStorage.removeItem('labToolUser')
                setAuthToken()
                setResponse({
                    ...response,
                    error: true,
                    msg: error.response.data.msg
                })
                console.log(error.response)
                openResponseModal()
                setSigninInputValue({
                    email: "",
                    password: ""
                })
            });
    }

    const userLogged = () => {
        axios.get(`${apiURL}user/user`)
            .then(response => {
                props.handlerUser(response.data)
                axios.post(`${apiURL}user/loginCount`, {fullname: response.data.fullname, date: formatDate(Date.now())})
            })
    }

    return (
        <div className="signup appGridParent grid">
            <div className="back">
                <Link className="Link" to="/">Back</Link>
            </div>
            <div className="logoSignin"><img src="../../img/LabTool_logo.png" alt="LabTool_logo" /></div>
            <form className="form signinForm">
                <div className="flex-column">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="E-mail" onChange={handleSigninInputChange} />
                </div>
                <div className="flex-column">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleSigninInputChange} />
                </div>
            </form>
            <button className="button1 signinButton" onClick={login}>SIGN IN</button>
            <p className="accountText" align="center">New user? <Link to="/signup" className="Link">Signup here</Link></p>
            <p className="guestText" align="center">Enter as a{"\n"}<a onClick={() => {login("guest")}}className="Link" style={{fontWeight: "bold"}}>Guest user</a></p>
            {response.success === true &&
                <ModalResponse ref={responseModalRef} response="true">
                    <div className="modalResponse">
                        <SuccessResponse />
                        <h4>{response.msg}</h4>
                        <button className="button1 sizeModalButton"><Link className="txtNoDeco" to="/home">Close</Link></button>
                    </div>
                </ModalResponse>
            }
            {response.error === true &&
                <ModalResponse ref={responseModalRef}>
                    <div className="modalResponse">
                        <ErrorResponse />
                        <h4>{response.msg}</h4>
                        <button className="button1 sizeModalButton" onClick={closeResponseModal}>Close</button>
                    </div>
                </ModalResponse>
            }
        </div>
    )
}

export default Signin