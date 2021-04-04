import React from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import {useState} from 'react'
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'


function SignUp() {

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

    //CREANDO NUEVO USUARIO
    const [signupInputValue, setSignupInputValue] = useState({
        fullname: "",
        position: "",
        email: "",
        password: "",
        rol: ""
    })
    const handleSignupInputChange = (event) => {
        setSignupInputValue({
            ...signupInputValue,
            [event.target.name] : event.target.value
        })
    }
    const register = () => {
        axios.post(`${apiURL}user/newuser`, 
  
        {...signupInputValue}
        )
        .then(res => {
            console.log("user added")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: `Hello ${res.data.fullname}! Wellcome to LabTool!`
            })
            openResponseModal()
        })
        .catch(error => {
            console.log(error.response)
            console.log("hay un error")
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
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" name="fullname" placeholder="Fullname" onChange={handleSignupInputChange}/>
                </div>
                <div>
                    <label htmlFor="position">Laboral position</label>
                    <input type="text" name="position" placeholder="position" onChange={handleSignupInputChange}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" placeholder="E-mail" onChange={handleSignupInputChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="text" name="password" placeholder="Password" onChange={handleSignupInputChange}/>
                </div>
                <div>
                    <label htmlFor="rol">Rol</label>
                    <select id="select" name="rol" onChange={handleSignupInputChange}>
                        <option defaultValue="rol">Rol</option>
                        <option value="validator">Validator</option>
                        <option defaultValue="user">User</option>
                    </select>
                </div>
            </form>
            <div>
                <button onClick={register}>CREATE ACCOUNT</button>
                <p>Already have an account? <Link to="/signin">Login here</Link></p>
            </div>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div>
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
                        {/* <p>{`Information about ${product.name} has been setting`}</p>   //esta ventna se comparte con msg delete success. */}
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

export default SignUp