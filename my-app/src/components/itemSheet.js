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




function ItemSheet(props) {

  
    console.log(props)

    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const modifyItemModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const deleteResponseModalRef = React.useRef();
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
    const openDeleteResponseModal = () => {
        deleteResponseModalRef.current.openModal()
    }
    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeModifyItemModal = () => {
        setToggleLimit(dataItem.control)
        setLimitInputValue({
            limit: "",
            automaticamount:""
        })
        setEdditInputValue({
            amount: "",
            storage:""
        })
        modifyItemModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        response.delete === true && props.history.push("/stock")
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


    const [response, setResponse] = useState({
        success: false,
        error: false,
        delete: false,
        msg: ""
    })



    const [dataItem, setDataItem] = useState([])
    const [change, setChange] = useState([])

    //CONSIGUIENDO LA DATA DEL ITEM
    const getData = () => {
    
        axios.get(`${apiURL}stock/${props.match.params.id}`)
        .then(res => {
            setDataItem(res.data)
            console.log("dataitem.control en "+ dataItem.control)
            setToggleLimit(dataItem.control)
            console.log("toglelimit en "+ toggleLimit)
        })
        .catch(error => {
            console.log(error.response)
        });
    }
    useEffect(() => {
        getData()
    },[change])


    
    //DELETE ITEM
    const deleteItem = () => {
        console.log(dataItem._id)
        axios.delete(`${apiURL}stock/deleteitem/${dataItem._id}`)
        .then(res => {
            console.log("Item eliminado")
            console.log(res.data)
            setResponse({...response,
                success: true,
                delete: true,
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

    const reduceItem = () => {
        
        console.log("se reduce")
        axios.put(`${apiURL}stock/reduce/${dataItem._id}`)
        .then(
            res => {
            console.log("Item reduced")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: res.data.msg
            })
            openResponseModal()
            setChange([])
        }
    
        // setChange([])
        )
        
        .catch(error => {
            console.log(error.response)
            setResponse({...response,
                error: true,
                msg: error.response.data.msg
            })
            openResponseModal()
        });
        
    }

    //EDITANDO PRODUCTO
    const [edditInputValue, setEdditInputValue] = useState({

    })
    const handleEdditInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setEdditInputValue({
            ...edditInputValue,
            [event.target.name] : value
        })
    }
    const edditItem = (event) => {

        event.preventDefault()
        axios.put(`${apiURL}stock/${dataItem._id}/modify`, {...edditInputValue})
        .then(res => {
            console.log("Item modificado")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: res.data.msg
            })
            openResponseModal()
            setChange([])
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
    

    
//-----------------------------
const [limitInputValue, setLimitInputValue] = useState({
    limit: "",
    automaticamount:""
})
const handleLimitInputChange = (event) => {
    const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
    setLimitInputValue({
        ...limitInputValue,
        [event.target.name] : value
    })
}
const setLimit = (event) => {
    event.preventDefault()
    console.log(limitInputValue)
    axios.put(`${apiURL}stock/${dataItem._id}/setlimit`, {...limitInputValue})
    .then(res => {
        console.log("limite establecido")
        console.log(res.data)
        setResponse({...response,
            success: true,
            msg: res.data.msg
        })
        openResponseModal()
        setChange([])
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

const [toggleLimit, setToggleLimit] = useState()

const handleToggleChange = (value) => {
    console.log("buton esta en " + value)
    setToggleLimit(value)
    
    
    setLimitInputValue({...edditInputValue,
    control: value
    })
}






    console.log(dataItem.control)
    console.log("togle limit esta en" + toggleLimit)
    console.log(props.location.productData.name)
    return (
        <div className="gridSection">
            <div className="back">
                <Link className="Link" to="/stock">Back</Link>
            </div>
            <div className="sheetBody sheetBodyRequest">
                <div className="sheetRequestName">
                    <h1>{props.location.productData.name}</h1>
                    <button className="button1 edditButton" onClick={openProductModal}>Show product Sheet</button>
                </div>
                <div className="sheetInfo requestInfo">
                    <p><b>In stock: </b>{dataItem.amount} unities</p>
                    <p><b>Storage: </b>{dataItem.storage}</p>
                    <p><b>Limit control: </b>{dataItem.control === true ? `Yes, ${dataItem.limit} units. Amount to order ${dataItem.automaticamount} units`: "No"}</p>
                    <p><b>Currently ordered? </b>{dataItem.request === true ? "Yes" : "No"}</p>
                    <p><b>Last arrival: </b>{dataItem.received}</p> {/* NO ME DEJA PONER .substring(0,10) */}
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
                    <div className="sheetBody sheetBodyProduct">
                        <div>
                            <img />
                            <h1>{props.location.productData.name}</h1>
                        </div>
                        <div className="sheetInfo">
                            <p><b>Catalog number: </b>{props.location.productData.catalog_number}</p>
                            <p><b>Type: </b>{props.location.productData.type}</p>
                            <p><b>Trading house: </b>{props.location.productData.trading_house}</p>
                            <p><b>Reference number: </b>{props.location.productData.reference_number}</p>
                            <p><b>Price: </b>{props.location.productData.price}€</p>
                            <p><b>Information: </b>{props.location.productData.information}</p>
                            {/* {item.information && <p>Information: {item.information}</p>} */}
                        </div>
                    </div>
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
                                <input type="text" name="amount" placeholder="Amount" onChange={handleEdditInputChange}/>
                            </div>
                            <div className="flex-column">
                                <label htmlFor="storage">Storage</label>
                                <input type="text" name="storage" placeholder="Storage" onChange={handleEdditInputChange}/>
                            </div>
                            <button className="button1 itemFormButton" onClick={edditItem}><p><b>Save</b></p></button>
                        </form>
                        <form className="form limitItemSec">
                            <p><b>LIMIT CONTROL</b></p>
                            <div className="yes-noLimit">
                           
                                    <label htmlFor="radioLimitYes">Yes</label>
                                    {dataItem.control === true ? <input type="radio" name="radioLimit" id="radioLimitYes" onChange={() => {handleToggleChange(true)}} defaultChecked/> : <input type="radio" name="radioLimit" id="radioLimitYes" onChange={() => {handleToggleChange(true)}}/>}
                            
                                    <label htmlFor="radioLimitNo">No</label>
                                    {dataItem.control === false ? <input type="radio" name="radioLimit" id="radioLimitNo" onChange={() => {handleToggleChange(false)}} defaultChecked/> : <input type="radio" name="radioLimit" id="radioLimitNo" onChange={() => {handleToggleChange(false)}}/>}
                             

                            </div>
                            {toggleLimit === true &&
                            <div className="limitForm">
                                <div className="flex-column">
                                    <label htmlFor="limit">Minimum amount</label>
                                    <input type="text" name="limit" placeholder={dataItem.control ===true ? dataItem.limit : "Minimum amount"} onChange={handleLimitInputChange}/>
                                </div>
                                <div className="flex-column">
                                    <label htmlFor="automaticamount">Quantity to order</label>
                                    <input type="text" name="automaticamount" placeholder={dataItem.control ===true ? dataItem.automaticamount : "Quantity"} onChange={handleLimitInputChange}/>
                                </div>
                            </div>
                            }
                            <button className="button1 itemFormButton" onClick={setLimit}><p><b>Set Limit</b></p></button>
                            
                        </form>
                        <div className="deleteItemDiv">
                            <button className="deleteButton"  onClick={openConfirmModal}><p><b>Delete</b></p></button>
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
            {/* <ModalResponse ref={deleteResponseModalRef}>
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <Link to="/stock" className="close">Close</Link>
                    </div>
            </ModalResponse> */}
        </div>
    )
}

export default withRouter(ItemSheet)