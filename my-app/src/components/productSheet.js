import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import { Link , Route} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import ModalConfirm from './modalConfirm';
import SuccessResponse from "./successResponse";
import ErrorResponse from "./errorResponse"
import apiURL from '../services/apiURL'

import {Redirect} from 'react-router-dom'


function ProductSheet(props) {

    // const product = props.location.data.product
    
    // VENTANAS MODALES
    const edditModalRef = React.useRef();
    const requestModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const confirmModalRef = React.useRef();
    const deleteResponseModalRef = React.useRef();
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
    const openDeleteResponseModal = () => {
        deleteResponseModalRef.current.openModal()
    }
    const closeEdditModal = () => {
        edditModalRef.current.closeModal()
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
    // function closeAll() {
    //     closeEdditModal()
    //     closeRequestModal()
    //     closeResponseModal()
    //     closeConfirmModal()
    // }


    //CONSIGUIENDO INFORMACIÓN DEL PRODUCTO
    const [dataProduct, setDataProduct] = useState([])
    const [change, setchange] = useState([])

    //CONSIGUIENDO LA DATA DEL PEDIDO
   
    useEffect(() => {
        const getData = () => {
            axios.get(`${apiURL}product/${props.match.params.id}`)
            .then(res => {
                console.log(res.data)
                setDataProduct(res.data)
            })
            .catch(error => {
                console.log(error.response)
            });
        }
        getData()
    },[change])

    console.log(dataProduct)

    //CREANDO NUEVO PEDIDO

    const [amountInputValue, setAmountInputValue] = useState({
        amount: ""
    })
    const handleAmountInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setAmountInputValue({
            ...amountInputValue,
            [event.target.name] : value
        })
    }

    const makeRequest = () => {
        
        axios.post(`${apiURL}order/neworder/${dataProduct._id}`, 
       
        {...amountInputValue}
        )
        .then(res => {
            console.log("pedido creado!")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: `Product ${dataProduct.name} ordered `
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
    
    //EDITANDO PRODUCTO
    const [edditInputValue, setEdditInputValue] = useState([])

    const handletEdditInputChange = (event) => {
        setEdditInputValue({
            ...edditInputValue,
            [event.target.name] : event.target.value
        })
    }
    const edditProduct = () => {

        axios.put(`${apiURL}product/${dataProduct._id}/modify`, {...edditInputValue})
        .then(res => {
            console.log("Producto modificado")
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

    //ELIMINANDO PRODUCTO
    const deleteProduct = () => {

        axios.delete(`${apiURL}product/deleteproduct/${dataProduct._id}`)
        .then(res => {
            console.log("Producto eliminado")
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
    return(
        <div className="gridSection"> 
            <div className="back">
                <Link className="Link" to="/products">Back</Link>
            </div>
            <div className="sheetBody">
                <div className="nameSheet">
                    <img />
                    <h1>{dataProduct.name}</h1>
                </div>
                <div className="sheetInfo">
                    <p><b>Catalog number: </b>{dataProduct.catalog_number}</p>
                    <p><b>Type: </b>{dataProduct.type}</p>
                    <p><b>Trading house: </b>{dataProduct.trading_house}</p>
                    <p><b>Reference number: </b>{dataProduct.reference_number}</p>
                    <p><b>Price: </b>{dataProduct.price}€</p>
                    {dataProduct.information != "" && <p><b>Information: </b>{dataProduct.information}</p>}
                    <button className="button1 edditButton" onClick={openEdditModal}>Eddit this product</button>
                </div>
            </div>
            <div className="playground playgroundSheet">
                <button className="button1 requestButton" onClick={openRequestModal}><h2>Make a request</h2></button>
            </div>
            <Modal ref={requestModalRef}>
                <div className="modalHead">
                    <h1>Make a Request</h1>
                    <button className="closeButton" onClick={closeRequestModal}>X</button>
                </div>
                <form className="form modalFormRequest">
                    <p align="center"><b>¿How many unities would you like to request?</b></p>
                    <div className="flex-column">
                        <label align="center" htmlFor="amount">Amount</label>
                        <input type="text" name="amount" placeholder="Amount to request" onChange={handleAmountInputChange}/>
                    </div>
                </form>
                <button className="button1 requestButton" onClick={makeRequest}>OK!</button>
            </Modal>
            <Modal ref={edditModalRef}>
                <div className="modalHead">
                    <h1>Modify product</h1>
                    <button className="closeButton" onClick={closeEdditModal}>X</button>
                </div>
                <form className="form modalFormRequest">
                    <div className="flex-column">
                        <label htmlFor="information">Information</label>
                        <input type="text" name="information" placeholder="Write here" onChange={handletEdditInputChange}/>
                    </div>
                </form>
                <button className="button1 requestButton" onClick={edditProduct}>Save</button>
                <button className="deleteButton"onClick={openConfirmModal}>Delete</button>
            
            </Modal>
            <ModalConfirm ref={confirmModalRef}>
                <h1>Are you sure?</h1>
                <button onClick={deleteProduct}>Yes</button>
                <button onClick={closeConfirmModal}>No</button>
            </ModalConfirm>
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    {closeRequestModal()}
                    {closeEdditModal()}
                    {closeConfirmModal()}
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
            <ModalResponse ref={deleteResponseModalRef}>
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <Link to="/products" >Close</Link>
                    </div>
            </ModalResponse>
        </div>
    )
}

export default ProductSheet