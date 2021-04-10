import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios';
import {useState, useEffect} from 'react';
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import setAuthToken from '../services/authToken'
import PropTypes from 'prop-types'


function Signin(props) {

    // const [user, setUser] = useState({})

    const userLogged = () => {
        console.log("pasa por userlogged")
        axios.get(`${apiURL}user/user`)
        .then(response => {
            console.log(response.data)
            props.handlerUser(response.data)
        })
    }




    
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


    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })

    //LOGUEANDO USUARIO
    const [signinInputValue, setSigninInputValue] = useState({
        email: "",
        password: ""
    })
    const handleSigninInputChange = (event) => {
        setSigninInputValue({
            ...signinInputValue,
            [event.target.name] : event.target.value
        })
    }
    const login = () => {
        axios.post(`${apiURL}login/`, 
  
        {...signinInputValue}
        )
        .then(res => {
            console.log(res)
            localStorage.removeItem('labToolUser')
            localStorage.setItem('labToolUser', res.data)
            // handleUserInfo({name: res.data.name, email: res.data.email, position: res.data.position, rol: res.data.rol, id: res.data.id})
            setAuthToken(res.data)
            setResponse({...response,
                success: true,
                msg: `Wellcome back!`
            })
            openResponseModal()
            userLogged()
        })
        .catch(error => {
            console.log(error)
            localStorage.removeItem('labToolUser')
            setAuthToken()
            setResponse({...response,
                error: true,
                msg: error.response.data.msg
            })
            openResponseModal()
        });
    }
    


    return (
        <div className="signup appGridParent grid">
            <div className="logoSignin"><img src="../../img/LabTool_logo.png" alt="LabTool_logo"/></div>
            <form className="form signinForm">
                <div className="flex-column">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="E-mail" onChange={handleSigninInputChange}/>
                </div>
                <div className="flex-column">
                    <label htmlFor="password">Password</label>
                    <input type="text" name="password" placeholder="Password" onChange={handleSigninInputChange}/>
                </div>
            </form>
            <button className="button1 signinButton" onClick={login}>SIGN IN</button>
            <p className="accountText" align="center">New user? <Link to="/signup" className="Link">Signup here</Link></p>
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