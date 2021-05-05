import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'
import formatDate from '../services/formatDate'

function ItemSheet(props) {

    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const modifyItemModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const openProductModal = () => {
        productModalRef.current.openModal()
    };
    const openModifyItemModal = () => {
        modifyItemModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const openConfirmModal = () => {
        confirmModalRef.current.openModal()
    }
    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeModifyItemModal = () => {
        setToggleLimit(dataItem.control)
        setLimitInputValue({
            limit: "",
            automaticamount: ""
        })
        setEdditInputValue({
            amount: "",
            storage: ""
        })
        modifyItemModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        response.delete === true && props.history.push("/stockitems")
        response.success === true && closeModifyItemModal()
        closeConfirmModal()
        setResponse({
            error: false,
            success: false,
            delete: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };
    const closeConfirmModal = () => {
        confirmModalRef.current.closeModal()
    };

    //ESTADOS
    const [response, setResponse] = useState({
        success: false,
        error: false,
        delete: false,
        msg: ""
    })
    const [dataItem, setDataItem] = useState({
        product: "",
        amount: "",
        storage: "",
        control: "",
        limit: "",
        automaticamount: "",
        status: "",
        request: "",
        received: ""
    })
    const [edditInputValue, setEdditInputValue] = useState({
        amount: "",
        storage: ""
    })
    const [limitInputValue, setLimitInputValue] = useState({
        limit: "",
        automaticamount: ""
    })
    const [toggleLimit, setToggleLimit] = useState()
    const [change, setChange] = useState([])

    //CONSIGUIENDO LA DATA DEL ITEM
    const getData = () => {
        axios.get(`${apiURL}stock/${props.match.params.id}`)
            .then(res => {
                setDataItem(res.data)
                setToggleLimit(res.data.control)
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

    //DELETE ITEM
    const deleteItem = () => {
        axios.delete(`${apiURL}stock/deleteitem/${dataItem._id}`)
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

    //REDUCIENDO ITEM
    const reduceItem = () => {
        axios.put(`${apiURL}stock/reduce/${dataItem._id}`)
            .then(
                res => {
                    setResponse({
                        ...response,
                        success: true,
                        msg: res.data.msg
                    })
                    openResponseModal()
                    setChange([])
                }
            )
            .catch(error => {
                setResponse({
                    ...response,
                    error: true,
                    msg: error.response.data.msg
                })
                openResponseModal()
            });
    }

    //EDITANDO PRODUCTO
    const handleEdditInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setEdditInputValue({
            ...edditInputValue,
            [event.target.name]: value
        })
    }
    const edditItem = (event) => {
        event.preventDefault()
        axios.put(`${apiURL}stock/${dataItem._id}/modify`, { ...edditInputValue })
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                openResponseModal()
                setChange([])
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

    //ESTABLECIENDO LÍMITE
    const handleLimitInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setLimitInputValue({
            ...limitInputValue,
            [event.target.name]: value
        })
    }
    const setLimit = (event) => {
        event.preventDefault()
        axios.put(`${apiURL}stock/${dataItem._id}/setlimit`, { ...limitInputValue })
            .then(res => {
                setResponse({
                    ...response,
                    success: true,
                    msg: res.data.msg
                })
                openResponseModal()
                setChange([])
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

    const handleToggleChange = (value) => {
        setToggleLimit(value)
        setLimitInputValue({
            ...edditInputValue,
            control: value
        })
    }

    return (
        <div className="gridSection">
            <div className="back">
                <Link className="Link" to="/stockitems">Back</Link>
            </div>
            <div className="sheetBody sheetBodyRequest">
                <div className="sheetRequestName">
                    <h1>{dataItem.product != null ? dataItem.product.name : "No product"}</h1>
                    <button className="button1 edditButton" onClick={openProductModal}>Show product Sheet</button>
                </div>
                <div className="sheetInfo requestInfo">
                    <p><b>In stock: </b>{dataItem.amount} unities</p>
                    <p><b>Storage: </b>{dataItem.storage}</p>
                    <p><b>Limit control: </b>{dataItem.control === true ? `Yes, ${dataItem.limit} units. Amount to order ${dataItem.automaticamount} units` : "No"}</p>
                    <p><b>Currently ordered? </b>{dataItem.request === true ? "Yes" : "No"}</p>
                    <p><b>Last arrival: </b>{dataItem.received !== "" && formatDate(dataItem.received)}</p>
                    <button className="button1 edditItemButton" onClick={openModifyItemModal}><p>Modify item or set a <b>limit control</b></p></button>
                </div>
            </div>
            <div className="playground playgroundSheet">
                <button className="spendButton" onClick={reduceItem}><h2>Spend one unit</h2></button>
            </div>
            <Modal ref={productModalRef}>
                <div className="Section">
                    <div className="modalHead">
                        <button className="closeButton" onClick={closeProductModal}>X</button>
                    </div>
                    {dataItem.product == null ? <div style={{ margin: "20px" }}><h1>No product</h1> </div> :
                        <div className="sheetBody sheetBodyProduct">
                            <div>
                                <h1>{dataItem.product.name}</h1>
                            </div>
                            <div className="sheetInfo">
                                <p><b>Catalog number: </b>{dataItem.product.catalog_number}</p>
                                <p><b>Type: </b>{dataItem.product.type}</p>
                                <p><b>Trading house: </b>{dataItem.product.trading_house}</p>
                                <p><b>Reference number: </b>{dataItem.product.reference_number}</p>
                                <p><b>Price: </b>{dataItem.product.price}€</p>
                                <p><b>Information: </b>{dataItem.product.information}</p>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
            <Modal ref={modifyItemModalRef}>
                <div className="edditItemModal">
                    <div className="modalHead">
                        <h1>Edit and set limit</h1>
                        <button className="closeButton" onClick={closeModifyItemModal}><p><b>X</b></p></button>
                    </div>
                    <div className="editItemBody">
                        <form className="form edditItemSec">
                            <div className="flex-column">
                                <label htmlFor="amount">Amount</label>
                                <input type="text" name="amount" placeholder="Amount" onChange={handleEdditInputChange} />
                            </div>
                            <div className="flex-column">
                                <label htmlFor="storage">Storage</label>
                                <input type="text" name="storage" placeholder="Storage" onChange={handleEdditInputChange} />
                            </div>
                            <button className="button1 itemFormButton" onClick={edditItem}><p><b>Save</b></p></button>
                        </form>
                        <form className="form limitItemSec">
                            <p><b>LIMIT CONTROL</b></p>
                            <div className="yes-noLimit">
                                <input type="radio" name="radioLimit" id="radioLimitYes" onChange={() => { handleToggleChange(true) }} defaultChecked={dataItem.control} />
                                <label htmlFor="radioLimitYes">Yes</label>
                                <input type="radio" name="radioLimit" id="radioLimitNo" onChange={() => { handleToggleChange(false) }} defaultChecked={!dataItem.control} />
                                <label htmlFor="radioLimitNo">No</label>
                            </div>
                            {toggleLimit === true &&
                                <div className="limitForm">
                                    <div className="flex-column">
                                        <label htmlFor="limit">Minimum amount</label>
                                        <input type="text" name="limit" placeholder={dataItem.control === true ? dataItem.limit : "Minimum amount"} onChange={handleLimitInputChange} />
                                    </div>
                                    <div className="flex-column">
                                        <label htmlFor="automaticamount">Quantity to order</label>
                                        <input type="text" name="automaticamount" placeholder={dataItem.control === true ? dataItem.automaticamount : "Quantity"} onChange={handleLimitInputChange} />
                                    </div>
                                </div>
                            }
                            <button className="button1 itemFormButton" onClick={setLimit}><p><b>Set Limit</b></p></button>
                        </form>
                        <div className="deleteItemDiv">
                            <button className="deleteButton" onClick={openConfirmModal}><p><b>Delete</b></p></button>
                        </div>
                    </div>
                </div>
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
                        <button className="deleteButton" onClick={deleteItem}>Yes</button>
                        <button className="deleteButton" onClick={closeConfirmModal}>No</button>
                    </div>
                </div>
            </ModalResponse>
        </div>
    )
}

export default withRouter(ItemSheet)