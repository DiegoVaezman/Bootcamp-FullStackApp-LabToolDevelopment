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

    const item = props.location.data.item
    console.log(props)

    // VENTANAS MODALES
    const productModalRef = React.useRef();
    const modifyItemModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmDeleteModalRef = React.useRef();
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

    const closeProductModal = () => {
        productModalRef.current.closeModal()
    };
    const closeModifyItemModal = () => {
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
        setEdditInputValue({
            ...edditInputValue,
            [event.target.name] : event.target.value
        })
    }
    const edditItem = () => {

        console.log(edditInputValue)
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

    const [toggleLimit, setToggleLimit] = useState({
        status: false
    })

    const toggleChange = () => {
        setToggleLimit({
            status : !toggleLimit.status
        })
        setEdditInputValue({
            ...edditInputValue,
            control : !toggleLimit.status
        })
    }
    console.log(toggleLimit)
    console.log(dataItem)
    return (
        <div>
            <Link to="/stock">Back</Link>
            <div>
            <img></img>
            <h1>{"Nombre de producto enlazado al item"}</h1>
            </div>
            <div>
                <button onClick={openProductModal}>Show product Sheet</button>
                <p>Amount in stock: {dataItem.amount}</p>
                <p>Storage: {dataItem.storage}</p>
                <p>Limit control: {dataItem.control === true ? `Yes, limit ${dataItem.limit} units`: "No"}</p>
                <p>Currently ordered? {dataItem.ordered === true ? "Yes" : "No"}</p>
                <p>Last arrival: {item.received.substring(0,10)}</p>
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
                    </div>
                    <div>
                        <div>
                            <label htmlFor="toggleLimit">Limit control</label>
                            {dataItem.control === false ? <input type="checkbox" name="ToggleLimit" onClick={toggleChange} /> : <input type="checkbox" name="ToggleLimit" onClick={toggleChange} checked/>}
                            <p>{toggleLimit.status === true ? "Yes" : "No"}</p>
                        </div>
                        {toggleLimit.status === true &&
                            <div>
                            <div>
                                <label htmlFor="limit">Minimum amount</label>
                                <input type="text" name="limit" placeholder="minimum amount" onChange={handleEdditInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="automaticamount">Quantity to order</label>
                                <input type="text" name="automaticamount" placeholder="Quantity" onChange={handleEdditInputChange}/>
                            </div>
                        </div>
                        }
                    </div>
                </form>
                <div>
                    <button onClick={edditItem}>Save</button>
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
                    {closeModifyItemModal}
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
        </div>
    )
}

export default ItemSheet