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
    const [edditInputValue, setEdditInputValue] = useState({})

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
        <div> 
            <Link to="/products">Back</Link>
            <button onClick={openEdditModal}>Eddit this product</button>
            <div>
                <img />
                <h1>{dataProduct.name}</h1>
            </div>
            <div>
                <p>Catalog number: {dataProduct.catalog_number}</p>
                <p>Type: {dataProduct.type}</p>
                <p>Trading house: {dataProduct.trading_house}</p>
                <p>Reference number: {dataProduct.reference_number}</p>
                <p>Price: {dataProduct.price}€</p>
                {dataProduct.information != "" && <p>Information: {dataProduct.information}</p>}
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
                    {closeRequestModal()}
                    {closeEdditModal()}
                    {closeConfirmModal()}
                    <div>
                        <SuccessResponse />
                        <h1>{response.msg}</h1>
                        {/* <p>{`Information about ${product.name} has been setting`}</p>   //esta ventna se comparte con msg delete success. */}
                        {/* <Link to="/products" className="close">Close</Link> */}
                        <button onClick={closeResponseModal}>Close</button>
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
            <ModalResponse ref={deleteResponseModalRef}>
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <Link to="/products" className="close">Close</Link>
                    </div>
            </ModalResponse>
        </div>
    )
}

export default ProductSheet