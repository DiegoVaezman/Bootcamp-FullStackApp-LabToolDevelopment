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
import CommentsListItem from './commentsListItem'




function RequestSheet(props) {
    console.log(props)
    const order = props.location.data.order
    const estado = props.location.data.order.status
    const user = props



    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const addCommentModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmRejectModalRef = React.useRef();
    const confirmDeleteModalRef = React.useRef();
    const openProductModal = () => {
        productModalRef.current.openModal()
    };
    const openAddCommentModal = () => {
        addCommentModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const openConfirmRejectModal = () => {
        confirmRejectModalRef.current.openModal()
    }
    const openConfirmDeleteModal = () => {
        confirmDeleteModalRef.current.openModal()
    }

    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeAddCommentModal = () => {
        addCommentModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };
    const closeConfirmRejectModal = () => {
        confirmRejectModalRef.current.closeModal()
    };
    const closeConfirmDeleteModal = () => {
        confirmDeleteModalRef.current.closeModal()
    };

    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })



    //VALIDANDO PEDIDO
    // const [edditUserInputValue, setEdditUserInputValue] = useState({
    //     fullname: "",
    //     position: ""
    // })
    // const handleEdditUserInputChange = (event) => {
    //     setEdditUserInputValue({
    //         ...edditUserInputValue,
    //         [event.target.name] : event.target.value
    //     })
    // }
    // const edditUser = () => {
     
    //     axios.put(`${apiURL}user/modify`, 

    //     {...edditUserInputValue}
    //     )
    //     .then(res => {
    //         const newLocalStorage = JSON.parse(localStorage.getItem("labToolUser"))
    //         newLocalStorage.name = edditUserInputValue.fullname
    //         newLocalStorage.position = edditUserInputValue.position
    //         localStorage.setItem('labToolUser', JSON.stringify(newLocalStorage))
    //         setResponse({...response,
    //             success: true,
    //             msg: `User information modified.`
    //         })
    //         openResponseModal()
    //     })
    //     .catch(error => {
    //         console.log(error.response)
    //         console.log("hay un error")
    //         setResponse({...response,
    //             error: true,
    //             msg: error.response.data.msg
    //         })
    //         openResponseModal()
    //     });
    // }


    //DELETE PEDIDO
    const deleteRequest = () => {
    
        axios.delete(`${apiURL}/deleteorder/${order._id}`)
        .then(res => {
            console.log("Order eliminado")
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


    // CONSIGUIENDO LA DATA DE MENSAJE
    const [commentsData, setCommentsData] = useState([])

    async function getCommentsData() {
        const dataBase = await axios.get(`${apiURL}comment/${order._id}`);
        setCommentsData(dataBase.data)
    }
    useEffect(() => {
        getCommentsData()
    },[])

    console.log(commentsData)



    //VALIDANDO UN PEDIDO
    const validateRequest = () => {
    
        axios.put(`${apiURL}order//validate/${order._id}`)
        .then(res => {
            console.log("Order validated")
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



    //RECHAZANDO UN PEDIDO
    const rejectRequest = () => {
    
        axios.put(`${apiURL}order/reject/${order._id}`)
        .then(res => {
            console.log("Order rejected")
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


    //ENVIANDO COMENTARIO
    const [commentInputValue, setCommentInputValue] = useState({
        text: ""
    })
    const handleCommentInputChange = (event) => {
        setCommentInputValue({
            ...commentInputValue,
            [event.target.name] : event.target.value
        })
    }

    const sendComment = () => {
        
        axios.post(`${apiURL}comment/newcomment/${order._id}`, 
       
        {...commentInputValue}
        )
        .then(res => {
            console.log("comentario enviado!")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: `Comment sent`
            })
            openResponseModal()
            getCommentsData()
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


    return (
        <div>
            <Link to="/requests">Back</Link>
            <div>
            <img></img>
            <h1>{"Nombre de producto enlazado del pedido"}</h1>
            </div>
            <div>
                <button onClick={openProductModal}>Show product Sheet</button>
                <p>Amount to order: {order.amount}</p>
                <p>Requested by: {"nombre del usuario enlazado al pedido"}</p>
                <p>Date: {order.date.substring(0,10)}</p>
                {(order.status === "waiting") && <p style={{color: "orange"}}>Status: {order.status}</p>}
                {(order.status === "validated") && <p style={{color: "green"}}>Status: {order.status}</p>}
                {(order.status === "received") && <p style={{color: "blue"}}>Status: {order.status}</p>}
                {(order.status === "rejected") && <p style={{color: "red"}}>Status: {order.status}</p>}
            </div>

            <div>
                <h2>Comments</h2>
                {(commentsData.length > 0) &&
                <div className="list">
                    {commentsData.map((item, index) => {
                        return <CommentsListItem comment={item} key={index} />
                    })}
                </div>}
            </div>
            <div>
                <img className="imagen de comentario"></img>
                <button onClick={openAddCommentModal}>Add new comment</button>
            </div>
            
           
            {(order.status != "received") && 
            <div>
                {order.status != "validated" && 
                    <button onClick={validateRequest}>VALIDATE</button>
                }
                <button onClick={openConfirmRejectModal}>REJECT</button>
            </div>
            }


            <div>
                <button onClick={openConfirmDeleteModal}>Delete order request</button>
            </div>

            <Modal ref={productModalRef}>
                <button onClick={closeProductModal}className="close">Close</button>
                <div>
                    <img />
                    <h1>{"nombre del producto enlazado al pedido"}</h1>
                </div>
                <div>
                    <p>Catalog number: {"product.catalog_number"}</p>
                    <p>Type: {"product.type"}</p>
                    <p>Trading house: {"product.trading_house"}</p>
                    <p>Reference number: {"product.reference_number"}</p>
                    <p>Price: {"product.price"}€</p>
                    <p>information: </p>
                    {/* <p>information: "{product.information != "" && <p>Information: {product.information}</p>}"</p> */}
                </div>
            </Modal>
            <Modal ref={addCommentModalRef}>
                <button onClick={closeAddCommentModal}className="close">Close</button>
                    <p>Add a comment to the order request</p>
                    <form>
                        <div>
                            <label htmlFor="text">Comment</label>
                            <input type="text" name="text" placeholder="Write a comment" onChange={handleCommentInputChange}/>
                        </div>
                    </form>
                <button onClick={sendComment}>Send</button>
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
            <ModalConfirm ref={confirmRejectModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={rejectRequest}>Yes</button>
                <button onClick={closeConfirmRejectModal}>No</button>   {/* ESTO NO SIRVE O DEBERÍA SER DE OTRA FORMA */}
            </ModalConfirm>
            <ModalConfirm ref={confirmDeleteModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={deleteRequest}>Yes</button>
                <button onClick={closeConfirmDeleteModal}>No</button>   {/* ESTO NO SIRVE O DEBERÍA SER DE OTRA FORMA */}
            </ModalConfirm>
        </div>
    )
}

export default RequestSheet