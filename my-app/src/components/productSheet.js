import React from 'react';
import axios from 'axios';
import {useState} from 'react'
import { Link , Route} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import ModalConfirm from './modalConfirm';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'

import {Redirect} from 'react-router-dom'


function ProductSheet(props) {

    const product = props.location.data.product
    
    // VENTANAS MODALES
    const edditModalRef = React.useRef();
    const requestModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const openEdditModal = () => {
        edditModalRef.current.openModal()
        console.log("editmodal abierto")
    };
    const openRequestModal = () => {
        requestModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
        console.log("response modal abierto")
    };
    const openConfirmModal = () => {
        confirmModalRef.current.openModal()
    }
    const closeEdditModal = () => {
        edditModalRef.current.closeModal()
        console.log("editmodal cerrado")
    };
    const closeRequestModal = () => {
        requestModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
        console.log("response modal cerrado")
    };
    const closeConfirmModal = () => {
        confirmModalRef.current.closeModal()
    };

    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })



    //CREANDO NUEVO PEDIDO

    const [amountInputValue, setAmountInputValue] = useState({
        amount: "",
        // user: ""
    })
    const handleAmountInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setAmountInputValue({
            ...amountInputValue,
            [event.target.name] : value
        })
    }

    const makeRequest = () => {
        
        axios.post(`${apiURL}order/neworder/${product._id}`, 
       
        {...amountInputValue}
        )
        .then(res => {
            console.log("pedido creado!")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: `Product ${res.data.name} ordered `
            })
            openResponseModal()
        })
        .catch(error => {
            console.log(error)
            setResponse({...response,
                error: true,
                msg: error
            })
            openResponseModal()
        });
    }
    
    //EDITANDO PRODUCTO
    const [edditInputValue, setEdditInputValue] = useState({
        information: ""
    })
    const handletEdditInputChange = (event) => {
        setEdditInputValue({
            ...edditInputValue,
            [event.target.name] : event.target.value
        })
    }
    const edditProduct = () => {

        axios.put(`${apiURL}product/${product._id}/modify`, {...edditInputValue})
        .then(res => {
            console.log("Producto modificado")
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

    //ELIMINANDO PRODUCTO
    const deleteProduct = () => {

        axios.delete(`${apiURL}product/deleteproduct/${product._id}`)
        .then(res => {
            console.log("Producto eliminado")
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
    return(
        <div> 
            <Link to="/products">Back</Link>
            <button onClick={openEdditModal}>Eddit this product</button>
            <div>
                <img />
                <h1>{product.name}</h1>
            </div>
            <div>
                <p>Catalog number: {product.catalog_number}</p>
                <p>Type: {product.type}</p>
                <p>Trading house: {product.trading_house}</p>
                <p>Reference number: {product.reference_number}</p>
                <p>Price: {product.price}€</p>
                {product.information != "" && <p>Information: {product.information}</p>}
            </div>
            <button onClick={openRequestModal}>Make a request</button>
            <Modal ref={requestModalRef}>
            <button onClick={closeRequestModal}className="close">Close</button>
                <p>¿How many unities would you like to request?</p>
                <form>
                    <div>
                        <label htmlFor="amount">Amount</label>
                        <input type="text" name="amount" placeholder="Amount to request" onChange={handleAmountInputChange}/>
                    </div>
                </form>
            <button onClick={makeRequest}>OK!</button>
            </Modal>
            <Modal ref={edditModalRef}>
            <button onClick={closeEdditModal}className="close">Close</button>
                <p>Add some relevant information to product sheet</p>
                <form>
                    <div>
                        <label htmlFor="information">Information</label>
                        <input type="text" name="information" placeholder="Write here" onChange={handletEdditInputChange}/>
                    </div>
                </form>
            <button onClick={openConfirmModal}>Delete</button>
            <button onClick={edditProduct}>Save</button>
            </Modal>
            <ModalConfirm ref={confirmModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={deleteProduct}>Yes</button>
                <button onClick={closeConfirmModal}>No</button>
            </ModalConfirm>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div>
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
                        {/* <p>{`Information about ${product.name} has been setting`}</p>   //esta ventna se comparte con msg delete success. */}
                        {/* <Link to="/products" className="close">Close</Link> */}
                        {/* <button onClick={() => {closeEdditModal} () => {closeResponseModal}}>Close</button>    */}
                        <button onClick={closeEdditModal}>cerrar edit modal</button>
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

export default ProductSheet