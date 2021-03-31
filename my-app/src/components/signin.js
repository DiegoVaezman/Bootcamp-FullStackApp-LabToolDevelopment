import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios';
import {useState} from 'react'
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import setAuthToken from '../services/authToken'


function Signin() {

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
            localStorage.removeItem('labToolUser')
            setAuthToken(res.data.token)
            localStorage.setItem('labToolUser', JSON.stringify({token: res.data.token, name: res.data.name, email: res.data.email, position: res.data.position, rol: res.data.rol, id: res.data.id}))
            setResponse({...response,
                success: true,
                msg: `Wellcome back ${res.data.name}!`
            })
            openResponseModal()
        })
        .catch(error => {
            console.log(error.response)
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
        <div>
            <img></img>
            <form>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="E-mail" onChange={handleSigninInputChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="text" name="password" placeholder="Password" onChange={handleSigninInputChange}/>
                </div>
            </form>
            <div>
                <button onClick={login}>LOGIN</button>
                <p>New user? <Link to="/signup">Signup here</Link></p>
            </div>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div>
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
                        <Link to="/home" className="close">Close</Link>
                    </div>
                </ModalResponse>
            }
            {response.error === true && 
                <ModalResponse ref={responseModalRef}>
                    <div>
                        <ErrorResponse />
                        <p>{response.msg}</p>
                        <button onClick={closeResponseModal}className="close">Close</button>
                    </div>
                </ModalResponse>
            }
        </div>
    )
}

export default Signin