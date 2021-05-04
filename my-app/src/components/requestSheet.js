import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import CommentsListItem from './commentsListItem'
import formatDate from '../services/formatDate'

function RequestSheet(props) {

    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const addCommentModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmRejectModalRef = React.useRef();
    const confirmModalRef = React.useRef();
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
    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeAddCommentModal = () => {
        addCommentModalRef.current.closeModal()
        setCommentInputValue({ text: "" })
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

    //ESTADOS
    const [change, setchange] = useState([])
    const [commentsData, setCommentsData] = useState([])
    const [dataRequest, setDataRequest] = useState({
        _id: "",
        product: "",
        amount: "",
        user: "",
        status: "",
        date: ""
    })
    const [response, setResponse] = useState({
        success: false,
        error: false,
        delete: false,
        msg: ""
    })
    const [commentInputValue, setCommentInputValue] = useState({
        text: ""
    })

    //CONSIGUIENDO LA DATA DEL PEDIDO
    const getData = () => {
        axios.get(`${apiURL}order/${props.match.params.id}`)
            .then(res => {
                setDataRequest(res.data)
            })
            .catch(error => {
                setResponse({
                    ...response,
                    error: true,
                    msg: "Was a problem getting the data"
                })
                openResponseModal()
            });
    }
    useEffect(() => {
        let token = localStorage.getItem("labToolUser");
        props.autoLogin(token)
        getData()
    }, [change])

    //DELETE PEDIDO
    const deleteRequest = () => {
        axios.delete(`${apiURL}order/deleteorder/${dataRequest._id}`)
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    delete: true,
                    msg: res.data.msg
                })
                openResponseModal()
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

    // CONSIGUIENDO LA DATA DE MENSAJE
    async function getCommentsData() {
        const dataBase = await axios.get(`${apiURL}comment/${props.match.params.id}`);
        setCommentsData(dataBase.data)
    }
    useEffect(() => {
        getCommentsData()
    }, [])

    //VALIDANDO UN PEDIDO
    const validateRequest = () => {
        axios.put(`${apiURL}order//validate/${props.match.params.id}`)
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                openResponseModal()
                setchange([])
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

    //RECHAZANDO UN PEDIDO
    const rejectRequest = () => {
        axios.put(`${apiURL}order/reject/${props.match.params.id}`)
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                openResponseModal()
                setchange([])
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

    //ENVIANDO COMENTARIO
    const handleCommentInputChange = (event) => {
        setCommentInputValue({
            ...commentInputValue,
            [event.target.name]: event.target.value
        })
    }
    const sendComment = () => {
        axios.post(`${apiURL}comment/newcomment/${props.match.params.id}`, { ...commentInputValue })
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: `Comment sent`
                })
                openResponseModal()
                getCommentsData()
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

    //AÑADIENDO AL STOCK
    const addToStock = () => {
        axios.post(`${apiURL}stock/newitem/${props.match.params.id}`)
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                openResponseModal()
                setchange([])
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

    const handleCommentChange = () => {
        getCommentsData()
    }

    return (
        <div className="gridSection">
            <div className="back">
                <Link className="Link" to="/requests">Back</Link>
            </div>
            <div className="sheetBody">
                <div className="sheetRequestName">
                    <h1>{(dataRequest.product != null) ? dataRequest.product.name : "No product"}</h1>
                    <button className="button1 edditButton" onClick={openProductModal}>Show product Sheet</button>
                </div>
                <div className="sheetInfo requestInfo">
                    <p><b>Amount to order: </b>{dataRequest.amount} unities</p>
                    <p><b>Requested by: </b>{(dataRequest.user != null) ? dataRequest.user.fullname : "No user"}</p>
                    <p><b>Date: </b>{dataRequest.date !== "" && formatDate(dataRequest.date)}</p>
                    {(dataRequest.status === "waiting") && <p className="" style={{ color: "orange" }}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "validated") && <p className="" style={{ color: "green" }}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "received") && <p className="" style={{ color: "blue" }}><b>Status: </b>{dataRequest.status}</p>}
                    {(dataRequest.status === "rejected") && <p className="" style={{ color: "red" }}><b>Status: </b>{dataRequest.status}</p>}
                </div>
                <h2>Comments</h2>
                {(commentsData.length > 0) &&
                    <div className="commentsList">
                        {commentsData.map((item, index) => {
                            return <CommentsListItem comment={item} key={index} user={props.user} setchange={handleCommentChange} />
                        })}
                    </div>}
                <div>
                    <button className="button1 edditButton" onClick={openAddCommentModal}>Add new comment</button>
                </div>
            </div>
            {(dataRequest.status !== "received") &&
                <div className="playground playgroundSheet">
                    <div className="validateButtons">
                        {dataRequest.status !== "validated" &&
                            <button className="val-rejButton valButton" onClick={validateRequest}><b>VALIDATE</b></button>
                        }
                        {dataRequest.status !== "rejected" &&
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
                    {dataRequest.product == null ? <div style={{ margin: "20px" }}><h1>No product</h1> </div> :
                        <div className="sheetBody sheetBodyProduct">
                            <div>
                                <h1>{dataRequest.product.name}</h1>
                            </div>
                            <div className="sheetInfo">
                                <p><b>Catalog number: </b>{dataRequest.product.catalog_number}</p>
                                <p><b>Type: </b>{dataRequest.product.type}</p>
                                <p><b>Trading house: </b>{dataRequest.product.trading_house}</p>
                                <p><b>Reference number: </b>{dataRequest.product.reference_number}</p>
                                <p><b>Price: </b>{dataRequest.product.price}€</p>
                                <p><b>Information: {dataRequest.product.information}</b></p>
                            </div>
                        </div>
                    }
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
                        <input type="text" name="text" placeholder="Write a comment" onChange={handleCommentInputChange} />
                    </div>
                </form>
                <button className="button1 requestButton" onClick={sendComment}><h2>Send</h2></button>
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