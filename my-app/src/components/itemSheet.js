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




function ItemSheet(props) {

  
    console.log(props)

    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const modifyItemModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmDeleteModalRef = React.useRef();
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
    const openConfirmDeleteModal = () => {
        confirmDeleteModalRef.current.openModal()
    }
    const openDeleteResponseModal = () => {
        deleteResponseModalRef.current.openModal()
    }
    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeModifyItemModal = () => {
        setToggleLimit(dataItem.control)
        modifyItemModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };
    const closeConfirmDeleteModal = () => {
        confirmDeleteModalRef.current.closeModal()
    };


    const [response, setResponse] = useState({
        success: false,
        error: false,
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
                msg: res.data.msg
            })
            openDeleteResponseModal()
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
        axios.put(`${apiURL}stock/reduce/${dataItem._id}`, {})
        .then(
        //     res => {
        //     console.log("Item reduced")
        //     console.log(res.data)
        //     setResponse({...response,
        //         success: true,
        //         msg: res.data.msg
        //     })
        //     openResponseModal()
        //     setchange()
        // }
    
        setChange([])
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




    console.log("togle limit esta en" + toggleLimit)
    console.log(props.location.productData.name)
    return (
        <div>
            <Link to="/stock">Back</Link>
            <div>
            <img></img>
            <h1>{props.location.productData.name}</h1>
            </div>
            <div>
                <button onClick={openProductModal}>Show product Sheet</button>
                <p>Amount in stock: {dataItem.amount}</p>
                <p>Storage: {dataItem.storage}</p>
                <p>Limit control: {dataItem.control === true ? `Yes, ${dataItem.limit} units. Amount to order ${dataItem.automaticamount} units`: "No"}</p>
                <p>Currently ordered? {dataItem.ordered === true ? "Yes" : "No"}</p>
                <p>Last arrival: {dataItem.received}</p>
            </div>
            <div>
                <button onClick={reduceItem}>Spend one unit</button>
                <button onClick={openModifyItemModal}>Modify item or set a limit control</button>
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
                    {/* {item.information && <p>Information: {item.information}</p>} */}
                </div>
            </Modal>
            <Modal ref={modifyItemModalRef}>
                <div>MODAL PARA MODIFICAR ITEM</div>
                <button onClick={closeModifyItemModal}>Close</button>
                <form className="form">
                    <div>
                        <div>
                            <label htmlFor="amount">Amount</label>
                            <input type="text" name="amount" placeholder="Amount" onChange={handleEdditInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="storage">Storage</label>
                            <input type="text" name="storage" placeholder="Storage" onChange={handleEdditInputChange}/>
                        </div>
                        <button onClick={edditItem}>Save</button>
                    </div>
                </form>
                <form className="form">
                    <div>
                        <div>
                            <p>Limit control</p>
                            <div>
                                <label htmlFor="radioLimitYes">Yes</label>
                                {dataItem.control === true ? <input type="radio" name="radioLimit" id="radioLimitYes" onChange={() => {handleToggleChange(true)}}defaultChecked/> : <input type="radio" name="radioLimit" id="radioLimitYes" onChange={() => {handleToggleChange(true)}}/>}
                            </div>
                            <div>
                                <label htmlFor="radioLimitNo">No</label>
                                {dataItem.control === false ? <input type="radio" name="radioLimit" id="radioLimitNo" onChange={() => {handleToggleChange(false)}} defaultChecked/> : <input type="radio" name="radioLimit" id="radioLimitNo" onChange={() => {handleToggleChange(false)}}/>}
                            </div>
                        </div>
                        {toggleLimit === true &&
                        <div>
                            <div>
                                <label htmlFor="limit">Minimum amount</label>
                                <input type="text" name="limit" placeholder="minimum amount" onChange={handleLimitInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="automaticamount">Quantity to order</label>
                                <input type="text" name="automaticamount" placeholder="Quantity" onChange={handleLimitInputChange}/>
                            </div>
                        </div>
                        }
                        <button onClick={setLimit}>Set Limit</button>
                    </div>
                </form>
                <div>
                    <button onClick={openConfirmDeleteModal}>Delete item</button>
                </div>
            </Modal>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    {closeConfirmDeleteModal()}
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
            <ModalConfirm ref={confirmDeleteModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={deleteItem}>Yes</button>
                <button onClick={closeConfirmDeleteModal}>No</button>   {/* ESTO NO SIRVE O DEBERÍA SER DE OTRA FORMA */}
            </ModalConfirm>
            <ModalResponse ref={deleteResponseModalRef}>
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <Link to="/stock" className="close">Close</Link>
                    </div>
            </ModalResponse>
        </div>
    )
}

export default ItemSheet