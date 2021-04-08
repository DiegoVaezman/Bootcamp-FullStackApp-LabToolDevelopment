import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import { Link , Route, Redirect, withRouter} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import ModalConfirm from './modalConfirm';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import UserListItem from './userListItem'
import CommentsListItem from './commentsListItem'




function RequestSheet(props) {

    const order = props.location.data.order
    console.log(props)

    const [dataRequest, setDataRequest] = useState([])
    const [change, setchange] = useState([])

    //CONSIGUIENDO LA DATA DEL PEDIDO
    const getData = () => {
    
        axios.get(`${apiURL}order/${props.match.params.id}`)
        .then(res => {
            console.log(res.data)
            setDataRequest(res.data)
        })
        .catch(error => {
            console.log(error.response)
        });
    }
    useEffect(() => {
        getData()
    },[change])


    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const addCommentModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmRejectModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const deleteResponseModalRef = React.useRef();
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
    const openConfirmModal = () => {
        confirmModalRef.current.openModal()
    }
    const openDeleteResponseModal = () => {
        deleteResponseModalRef.current.openModal()
    }

    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeAddCommentModal = () => {
        addCommentModalRef.current.closeModal()
        
    };
    const closeResponseModal = () => {
        response.delete === true && props.history.push("/requests")
        response.success === true && closeAddCommentModal()
        closeConfirmModal()
        closeConfirmRejectModal()
        setResponse({
            error: false,
            success: false,
            delete: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };
    const closeConfirmRejectModal = () => {
        confirmRejectModalRef.current.closeModal()
    };
    const closeConfirmModal = () => {
        confirmModalRef.current.closeModal()
    };


    const [response, setResponse] = useState({
        success: false,
        error: false,
        delete: false,
        msg: ""
    })



    //DELETE PEDIDO
    const deleteRequest = () => {
        console.log(dataRequest._id)
        axios.delete(`${apiURL}order/deleteorder/${dataRequest._id}`)
        .then(res => {
            console.log("Order eliminado")
            console.log(res.data)
            setResponse({...response,
                success: true,
                delete: true,
                msg: res.data.msg
            })
            // openDeleteResponseModal()
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
            setchange([])
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
            setchange([])
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

    //AÑADIENDO AL STOCK
    const addToStock = () => {
        console.log(order._id)
        axios.post(`${apiURL}stock/newitem/${order._id}`)
        .then(res => {
            console.log("añadido al stock")
            console.log(res)
            setResponse({...response,
                success: true,
                msg: res.data.msg
            })
            openResponseModal()
            setchange([])
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

    //CONSIGUIENDO EL USUARIO QUE HIZO EL PEDIDO
    const [userName, setUserName] = useState({
        data: {fullname:""}
    })
    async function getUserName() {
        console.log(props.location.data.order.user)
        const dataBase = await axios.get(`${apiURL}user/${props.location.data.order.user}`);
        setUserName(dataBase)
    }
    useEffect(() => {
        getUserName()
    },[])

    
    


    console.log(props)
    return (
        <div className="gridSection">
            <div className="back">
                <Link className="Link" to="/requests">Back</Link>
            </div>
            <div className="sheetBody sheetBodyRequest">
                <div className="sheetRequestName">
                    <h1>{props.location.productData.name}</h1>
                    <button className="button1 edditButton" onClick={openProductModal}>Show product Sheet</button>
                </div>
                <div className="sheetInfo requestInfo">
                    
                    <p><b>Amount to order: </b>{order.amount} unities</p>
                    <p><b>Requested by: </b>{userName.data.fullname}</p>
                    <p><b>Date: </b>{order.date.substring(0,10)}</p>
                    {(dataRequest.status === "waiting") && <p style={{color: "orange"}}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "validated") && <p style={{color: "green"}}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "received") && <p style={{color: "blue"}}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "rejected") && <p style={{color: "red"}}><b>Status: </b>{dataRequest.status}</p>}
                </div>
               
                    <h2>Comments</h2>
                    {(commentsData.length > 0) &&
                    <div className="commentsList">
                        {commentsData.map((item, index) => {
                            return <CommentsListItem comment={item} key={index} />
                        })}
                    </div>}
               
                <div>
                    <button className="button1 edditButton" onClick={openAddCommentModal}>Add new comment</button>
                </div>
            </div>

            {(dataRequest.status !== "received") &&
            <div className="playground playgroundSheet">
                <div className="validateButtons">
                    {dataRequest.status != "validated" &&
                        <button className="val-rejButton valButton" onClick={validateRequest}><b>VALIDATE</b></button>
                    }
                    {dataRequest.status != "rejected" &&
                        <button className="val-rejButton rejButton" onClick={openConfirmRejectModal}><b>REJECT</b></button>
                    }
                    {dataRequest.status === "validated" &&
                        <button className="val-rejButton addStockButton" onClick={addToStock}><p>Product arrived?</p><p><b>Add to stock</b></p></button>
                    }
                </div>
            </div>
            }
         
            <div className="deleteButtonDiv">
                <button className="deleteButton" onClick={openConfirmModal}>Delete</button>
            </div>
            <Modal ref={productModalRef}>
                <div className="Section">
                    <div className="modalHead">
                        <button className="closeButton" onClick={closeProductModal}>X</button>
                    </div>
                    <div className="sheetBody sheetBodyProduct">
                        <div>
                            <h1>{props.location.productData.name}</h1>
                        </div>
                        <div className="sheetInfo">
                            <p><b>Catalog number: </b>{props.location.productData.catalog_number}</p>
                            <p><b>Type: </b>{props.location.productData.type}</p>
                            <p><b>Trading house: </b>{props.location.productData.trading_house}</p>
                            <p><b>Reference number: </b>{props.location.productData.reference_number}</p>
                            <p><b>Price: </b>{props.location.productData.price}€</p>
                            <p><b>Information: </b></p>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal ref={addCommentModalRef}>
                
                    <div className="modalHead">
                        <h1>Add a comment to the order request</h1>
                        <button className="closeButton" onClick={closeAddCommentModal}>X</button>
                    </div>
                    <form className="form modalFormRequest">
                        <div className="flex-column">
                            <label htmlFor="text">Comment</label>
                            <input type="text" name="text" placeholder="Write a comment" onChange={handleCommentInputChange}/>
                        </div>
                    </form>
                <button className="button1 requestButton" onClick={sendComment}><h2>Send</h2></button>
            </Modal>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div className="modalResponse">
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
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
            {/* <ModalResponse ref={deleteResponseModalRef}>
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <Link to="/requests" className="close">Close</Link>
                    </div>
            </ModalResponse> */}
            <ModalResponse ref={confirmRejectModalRef}>
                <div className="modalResponse">
                    <h1>Are you sure?</h1>
                    <div className="yesNoButtons">
                        <button className="deleteButton" onClick={rejectRequest}>Yes</button>
                        <button className="deleteButton" onClick={closeConfirmRejectModal}>No</button>
                    </div>
                </div>
            </ModalResponse>
            <ModalResponse ref={confirmModalRef}>
                <div className="modalResponse">
                    <h1>Are you sure?</h1>
                    <div className="yesNoButtons">
                        <button className="deleteButton" onClick={deleteRequest}>Yes</button>
                        <button className="deleteButton" onClick={closeConfirmModal}>No</button>
                    </div> 
                </div>
            </ModalResponse>
        </div>
    )
}

export default withRouter(RequestSheet)