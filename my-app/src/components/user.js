import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import { Link , Route, Redirect} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import ModalConfirm from './modalConfirm';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import UserListItem from './userListItem'



function User(props) {

    // VENTANAS MODALES
    const edditUserModalRef = React.useRef();
    const usersModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const openEdditUserModal = () => {
        edditUserModalRef.current.openModal()
    };
    const openUsersModal = () => {
        usersModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const openConfirmModal = () => {
        confirmModalRef.current.openModal()
    }
    const closeEdditUserModal = () => {
        edditUserModalRef.current.closeModal()
    };
    const closeUsersModal = () => {
        usersModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };
    const closeConfirmModal = () => {
        confirmModalRef.current.closeModal()
    };

    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })



    //MODIFICANDO USUARIO
    const [edditUserInputValue, setEdditUserInputValue] = useState({})
    const handleEdditUserInputChange = (event) => {
        setEdditUserInputValue({
            ...edditUserInputValue,
            [event.target.name] : event.target.value
        })
    }
    const edditUser = (event) => {
        
        axios.put(`${apiURL}user/modify`, 

        {...edditUserInputValue}
        )
        .then(res => {
            setResponse({...response,
                success: true,
                msg: `User information modified.`
            })
            openResponseModal()
            console.log(res.data)
            props.handlerUser(res.data)
        })
        .catch(error => {
            console.log(error)
            setResponse({...response,
                error: true,
                msg: error.response.data.msg
            })
            openResponseModal()
        });
    }


    //DELETE USER
    const deleteUser = () => {
    
        axios.delete(`${apiURL}user/deleteuser`)
        .then(res => {
            console.log("user eliminado")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: res.data.msg
            })
            openResponseModal()
        })
        .catch(error => {
            console.log(error.response)
            setResponse({...response,
                error: true,
                msg: error.response.data.msg
            })
            openResponseModal()
        });
    }

    //LOG OUT
    const logout = () => {
        localStorage.removeItem("labToolUser");
        return <Redirect to='/' />   //NO REDIRECCIONAAA
    }



    //CONSIGUIENDO LA DATA DE USUARIOS PARA LISTA DE USUARIOS
    const [data, setData] = useState([])

    async function getData() {
        const dataBase = await axios.get(`${apiURL}user/`);
        setData(dataBase.data)
    }
    useEffect(() => {
        getData()
    },[])




    return (
        <div>
            <div>
            <img></img>
            <h1>{props.user.fullname}</h1>
            </div>
            <div>
                <p>E-mail: {props.user.email}</p>
                <p>Position: {props.user.position}</p>
                <p>Rol: {props.user.rol}</p>
            </div>
            <button onClick={openEdditUserModal}>Modify user information</button>
            <button onClick={logout}>Log out</button>

            <div>
                <h1>Users</h1>
                <div className="list">
                    {data.map((item, index) => {
                        return <UserListItem user={item} localState={data} key={index} />
                    })}
                </div>
            </div>


            <Modal ref={edditUserModalRef}>
                <div>
                    <h1>Modify user</h1>
                    <button onClick={closeEdditUserModal}className="close">Close</button>
                </div>
                <form className="form">
                    <div>
                        <label htmlFor="fullname">New name</label>
                        <input type="text" name="fullname" placeholder="New name" onChange={handleEdditUserInputChange}/>
                    </div>
                    <div>
                        <label htmlFor="position">New position</label>
                        <input type="text" name="position" placeholder="Position" onChange={handleEdditUserInputChange}/>
                    </div>
                </form>
                <div>
                    <button onClick={edditUser}>Save</button>
                    <button onClick={openConfirmModal}>Delete account</button>
                </div>
            </Modal>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div>
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
                        <button onClick={closeResponseModal}className="close">Close</button>
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
            <ModalConfirm ref={confirmModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={deleteUser}>Yes</button>
                <button onClick={closeConfirmModal}>No</button>   {/* ESTO NO SIRVE O DEBERÍA SER DE OTRA FORMA */}
            </ModalConfirm>
        </div>
    )
}

export default User