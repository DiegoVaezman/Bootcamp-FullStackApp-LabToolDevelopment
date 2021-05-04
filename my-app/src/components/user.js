import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import UserListItem from './userListItem'
import setAuthToken from '../services/authToken'

function User(props) {

    // VENTANAS MODALES
    const edditUserModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const openEdditUserModal = () => {
        edditUserModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const openConfirmModal = () => {
        confirmModalRef.current.openModal()
    }
    const closeEdditUserModal = () => {
        setEdditUserInputValue({})
        edditUserModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        response.success === true && closeEdditUserModal()
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

    //ESTADOS
    const [data, setData] = useState([])
    const [edditUserInputValue, setEdditUserInputValue] = useState({})
    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })

    //MODIFICANDO USUARIO
    const handleEdditUserInputChange = (event) => {
        setEdditUserInputValue({
            ...edditUserInputValue,
            [event.target.name]: event.target.value
        })
    }
    const edditUser = (event) => {
        axios.put(`${apiURL}user/modify`, { ...edditUserInputValue })
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: `User information modified.`
                })
                openResponseModal()
                props.handlerUser(res.data)
            })
            .catch(error => {
                setResponse({
                    ...response,
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
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                // openResponseModal()
                props.history.push('/signin')
            })
            .catch(error => {
                setResponse({
                    ...response,
                    error: true,
                    msg: error.response.data.msg
                })
                openResponseModal()
            });
    }

    //LOG OUT
    const logout = () => {
        localStorage.removeItem("labToolUser");
        setAuthToken()
        props.history.push('/signin')
    }

    //CONSIGUIENDO LA DATA DE USUARIOS PARA LISTA DE USUARIOS
    async function getData() {
        const dataBase = await axios.get(`${apiURL}user/`);
        setData(dataBase.data)
    }
    useEffect(() => {
        let token = localStorage.getItem("labToolUser");
        props.autoLogin(token)
        getData()
    }, [])

    return (
        <div className="gridSection">
            <div className="sheetBodyUser">
                <div className="userName">
                    <h1>{props.user.fullname}</h1>
                </div>
                <div className="sheetInfo requestInfo">
                    <p><b>E-mail: </b>{props.user.email}</p>
                    <p><b>Position: </b>{props.user.position}</p>
                    <p><b>Rol: </b>{props.user.rol}</p>
                    {props.user.email !== "guestuser@labtool.com" && <button className="button1 edditButton" onClick={openEdditUserModal}>Modify user</button>}
                </div>
                <button className="spendButton logoutButton" onClick={logout}><p><b>Log out</b></p></button>
                <h2>Users</h2>
                <div className="list usersList">
                    {data.map((item, index) => {
                        return <UserListItem user={item} localState={data} key={index} />
                    })}
                </div>
            </div>
            <Modal ref={edditUserModalRef}>
                <div className="modalHead">
                    <h1>Modify user</h1>
                    <button className="closeButton" onClick={closeEdditUserModal}>X</button>
                </div>
                <form className="form modalFormRequest">
                    <div className="flex-column">
                        <label htmlFor="fullname">New name</label>
                        <input type="text" name="fullname" placeholder="New name" onChange={handleEdditUserInputChange} />
                    </div>
                    <div className="flex-column">
                        <label htmlFor="position">New position</label>
                        <input type="text" name="position" placeholder="Position" onChange={handleEdditUserInputChange} />
                    </div>
                </form>
                <button className="button1 requestButton" onClick={edditUser}><h2>Save</h2></button>
                <button className="deleteButton" onClick={openConfirmModal}>Delete account</button>
            </Modal>
            {response.success === true &&
                <ModalResponse ref={responseModalRef} response="true">
                    <div className="modalResponse">
                        <SuccessResponse />
                        <p><b>{response.msg}</b></p>
                        <button className="button1 sizeModalButton" onClick={closeResponseModal}>Close</button>
                    </div>
                </ModalResponse>
            }
            {response.error === true &&
                <ModalResponse ref={responseModalRef}>
                    <div className="modalResponse">
                        <ErrorResponse />
                        <p><b>{response.msg}</b></p>
                        <button className="button1 sizeModalButton" onClick={closeResponseModal}>Close</button>
                    </div>
                </ModalResponse>
            }
            <ModalResponse ref={confirmModalRef}>
                <div className="modalResponse">
                    <h1>Are you sure?</h1>
                    <div className="yesNoButtons">
                        <button className="deleteButton" onClick={deleteUser}>Yes</button>
                        <button className="deleteButton" onClick={closeConfirmModal}>No</button>
                    </div>
                </div>
            </ModalResponse>
        </div>
    )
}

export default User