import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse"
import ErrorResponse from "./errorResponse"
import ProductListItem from './productListItem'
import apiURL from '../services/apiURL'



function ProductSection(dataBase){

    // VENTANAS MODALES
    const searchModalRef = React.useRef();
    const addModalRef = React.useRef();
    const responseModalRef = React.useRef();
    const openSearchModal = () => {
        searchModalRef.current.openModal()
    };
    const openAddModal = () => {
        addModalRef.current.openModal()
    };
    const openResponseModal = () => {
        responseModalRef.current.openModal()
    };
    const closeSearchModal = () => {
        setInputValue({
            byname: "",
            bycatn: "",
            byrefn:""
        })
        searchModalRef.current.closeModal()
    };
    const closeAddModal = () => {
        setAddInputValue({
            catalog_number: "",
            name: "",
            trading_house : "",
            reference_number: "",
            price : "",
            information : ""
        })
        addModalRef.current.closeModal()
    };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };

    const [loading, setLoading] = useState(true)

    //CONSIGUIENDO LA DATA DE PRODUCTOS DESDE DB
    const [data, setData] = useState([""])

    async function getData() {
        const dataBase = await axios.get(`${apiURL}product/`);
        if (dataBase.data.msg) { 
            return
        } else {
        setLoading(false)
        setData(dataBase.data)
        setDataFiltered(dataBase.data)
        }
    }
    useEffect(() => {
        getData()
    },[])

    


    //FILTRANDO LA DATA
    const [dataFiltered, setDataFiltered] = useState([data])

    
    const [inputValue, setInputValue] = useState({
        byname: "",
        bycatn: "",
        byrefn:""
    })
    const handletTypeInputChange = (event) => {
        setInputValue({
            ...inputValue,
            [event.target.name] : event.target.value
        })
    }
    const searchByName = (event) => {
        event.preventDefault();
        const name = inputValue.byname;
        setDataFiltered(data.filter(product => product.name.toLowerCase().includes(name)));
        document.getElementById("select").value = "Type"
        closeSearchModal()
    }
    const searchByCatN = (event) => {
        event.preventDefault();
        const catN = String(inputValue.bycatn);
        setDataFiltered(data.filter(product => String(product.catalog_number).includes(catN)));
        document.getElementById("select").value = "Type"
        closeSearchModal()
    }
    const searchByRefN = (event) => {
        event.preventDefault();
        const refN = inputValue.byrefn;
        setDataFiltered(data.filter(product => product.reference_number.toLowerCase().includes(refN)));
        document.getElementById("select").value = "Type"
        closeSearchModal()
    }
    const searchByType = (event) => {
        const type = event.target.value;
        if (type === "All") {
            setDataFiltered(data)
        } else {
            setDataFiltered(data.filter(product => product.type === type))
        }
    }
    

    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })




    //AÑADIENDO NUEVO PRODUCTO
    const [addInputValue, setAddInputValue] = useState({
        catalog_number: "",
        name: "",
        trading_house : "",
        reference_number: "",
        price : "",
        information : ""
    })
    const handleAddInputChange = (event) => {
        const value = !isNaN(event.target.value) ? parseFloat(event.target.value) : event.target.value
        setAddInputValue({
            ...addInputValue,
            [event.target.name] : value
        })
    }
    const addNewProduct = () => {
     
        axios.post(`${apiURL}product/newproduct`, {...addInputValue})
        .then(res => {
            console.log("producto añadido!")
            console.log(res.data)
            setResponse({...response,
                success: true,
                msg: `${res.data.name} has been added to the product list!`
            })
            openResponseModal()
            closeAddModal()
            getData()
        })
        .catch(error => {
            console.log(error)
            console.log("hay un error")
            setResponse({...response,
                error: true,
                msg: error.response.data
            })
            openResponseModal()
        });
    }

    

    return (
        <div className="gridSection grid">
            <div className="filter">
                <select id="select" name="bytype" onClick={searchByType}>
                    <option >Type</option>
                    <option defaultValue="All">All</option>
                    <option value="enzime">Enzimes</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="consumables">Consumables</option>
                    <option value="laboratory">laboratory</option>
                    <option value="garment">Garments</option>
                    <option value="stationery">Stationery</option>
                    <option value="plastic">Plastics</option>
                    <option value="chemical">Chemicals</option>
                    <option value="glass">Glass</option>
                    <option value="other">Others</option>
                    <option value="added">Added</option>
                </select>
                <button className="button1"onClick={openSearchModal}>Advanced Search</button>
            </div>

            <div className="list">
                {loading ? 
                <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                :
                dataFiltered.map((item, index) => {
                    return <ProductListItem product={item} localState={dataFiltered} key={index} />
                })
                }
            </div>
            
            <button className="button1 addProductBtn" onClick={openAddModal}>Add new product</button>

            <Modal ref={searchModalRef}>
               
                    <div className="modalHead">
                        <h1>Advanced search</h1>
                        <button className="closeButton"onClick={closeSearchModal}><b>X</b></button>
                    </div>
                        <form className="form modalForm modalFormSearch">
                            <div className="searchModalInput">
                                <div>
                                    <label htmlFor="byname">Search by product name</label>
                                    <input type="text" name="byname" placeholder="Product name" onChange={handletTypeInputChange}/>
                                </div>
                                <button className="button1" onClick={searchByName}>Search</button>
                            </div>
                            <div className="searchModalInput">
                                <div>
                                    <label htmlFor="bycatn">Search by catalog number </label>
                                    <input type="text" name="bycatn" placeholder="Catalog number" onChange={handletTypeInputChange}/>
                                </div>
                                <button className="button1" onClick={searchByCatN}>Search</button>
                            </div>
                            <div className="searchModalInput">
                                <div>
                                    <label htmlFor="byrefn">Search by reference number </label>
                                    <input type="text" name="byrefn" placeholder="Reference number" onChange={handletTypeInputChange}/>
                                </div>
                                <button className="button1" onClick={searchByRefN}>Search</button>
                            </div>
                        </form>
            </Modal>
            <Modal ref={addModalRef}>
                <div className="modal">
                    <div className="modalHead">
                        <h1>Add new product</h1>
                        <button className="closeButton" onClick={closeAddModal}>X</button>
                    </div>
                    <form className="form modalForm modalFormAdd">
                        <div className="flex-column">
                            <label htmlFor="catalog_number">*Catalog number</label>
                            <input type="text" name="catalog_number" placeholder="Catalog number" onChange={handleAddInputChange}/>
                        </div>
                        <div className="flex-column">
                            <label htmlFor="name">*Product name</label>
                            <input type="text" name="name" placeholder="Product name" onChange={handleAddInputChange}/>
                        </div>
                        <div className="flex-column">
                            <label htmlFor="trading_house">Trading house</label>
                            <input type="text" name="trading_house" placeholder="Trading house" onChange={handleAddInputChange}/>
                        </div>
                        <div className="flex-column">
                            <label htmlFor="reference_number">Reference number</label>
                            <input type="text" name="reference_number" placeholder="Reference number" onChange={handleAddInputChange}/>
                        </div>
                        <div className="flex-column">
                            <label htmlFor="price">*Price</label>
                            <input type="text" name="price" placeholder="Price" onChange={handleAddInputChange}/>
                        </div>
                        <div className="flex-column">
                            <label htmlFor="information">Product information</label>
                            <input type="text" name="information" placeholder="Information" onChange={handleAddInputChange}/>
                        </div>
                    </form>
                    <div className="addButtonDiv" ><button className="button1  addModalButton" onClick={addNewProduct}><h2>Add product to the list</h2></button></div>
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
                        <p><b>{response.msg.msg}</b></p>
                        <button className="button1 sizeModalButton" onClick={closeResponseModal}>Close</button>
                    </div>
                </ModalResponse>
            }
        </div>
    )
}

export default ProductSection