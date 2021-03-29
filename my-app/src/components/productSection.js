import React from 'react';
import List from './list';
import axios from 'axios';
import {useState, useEffect} from 'react'
import { Link, Route} from "wouter"
import Probando from "./prueba"
import Modal from "./Modal"
import apiURL from '../services/apiURL'


function ProductSection(dataBase){

    // VENTANAS MODALES
    const searchModalRef = React.useRef();
    const addModalRef = React.useRef();
    const openSearchModal = () => {
        searchModalRef.current.openModal()
    };
    const openAddModal = () => {
        addModalRef.current.openModal()
    };
    const closeSearchModal = () => {
        searchModalRef.current.closeModal()
    };
    const closeAddModal = () => {
        addModalRef.current.closeModal()
    };

    //CONSIGUIENDO LA DATA DE PRODUCTOS DESDE DB
    const [data, setData] = useState([])

    useEffect(() => {
        async function getData() {
            const dataBase = await axios.get(`${apiURL}product/`);
            setData(dataBase.data)
        }
        getData();
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
        closeSearchModal()
    }
    const searchByCatN = (event) => {
        event.preventDefault();
        const catN = String(inputValue.bycatn);
        setDataFiltered(data.filter(product => String(product.catalog_number).includes(catN)));
        closeSearchModal()
    }
    const searchByRefN = (event) => {
        event.preventDefault();
        const refN = inputValue.byrefn;
        setDataFiltered(data.filter(product => product.reference_number.toLowerCase().includes(refN)));
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

    //AÑADIENDO NUEVO PRODUCTO
    const [addInputValue, setAddInputValue] = useState({
        catalog_number: "",
        name: "",
        type : "added",
        trading_house : "",
        reference_number: "",
        price : "",
        information : ""
    })
    const handleAddInputChange = (event) => {
        setAddInputValue({
            ...addInputValue,
            [event.target.name] : event.target.value
        })
    }
    const addNewProduct = () => {
        //no consigo meter directamente los valores desde addInputValue
        const JSONPost = JSON.stringify(addInputValue)
        console.log(JSONPost)
        
        axios.post(`${apiURL}product/newproduct`, {
            catalog_number: Number(addInputValue.catalog_number),
            name: addInputValue.name,
            type : addInputValue.type,
            trading_house : addInputValue.trading_house,
            reference_number: addInputValue.reference_number,
            price : Number(addInputValue.price),
            information : addInputValue.information
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {
            console.log(error.response.data)
        });
    }
    return (
        <div>
            <div className="filter">
                <select id="select" name="bytype" placeholder="ddddd" onClick={searchByType}>
                    <option >Type</option>
                    <option defaultValue="All">All</option>
                    <option value="enzime">Enzimes</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="consumable">Consumables</option>
                    <option value="laboratory">laboratory</option>
                    <option value="garment">Garments</option>
                    <option value="stationery">Stationery</option>
                    <option value="plastic">Plastics</option>
                    <option value="chemical">Chemicals</option>
                    <option value="glass">Glass</option>
                    <option value="other">Others</option>
                    <option value="added">Productos agregados</option>
                </select>
                <button onClick={openSearchModal}>Advanced Search</button>
            </div>

            <List data={dataFiltered} section="products"/>

            <a onClick={openAddModal} className="add-link">Add new product</a>

            <Modal ref={searchModalRef}>
                <div>
                    <h1>Advanced search</h1>
                    <button onClick={closeSearchModal}className="close">Close</button>
                </div>
                <form className="form">
                    <div>
                        <label htmlFor="byname">Search by product name</label>
                        <input type="text" name="byname" placeholder="Product name" onChange={handletTypeInputChange}/>
                    </div>
                    <button onClick={searchByName}>Search</button>
                    <div>
                        <label htmlFor="bycatn">Search by catalog number </label>
                        <input type="text" name="bycatn" placeholder="Catalog number" onChange={handletTypeInputChange}/>
                    </div>
                    <button onClick={searchByCatN}>Search</button>
                    <div>
                        <label htmlFor="byrefn">Search by reference number </label>
                        <input type="text" name="byrefn" placeholder="Reference number" onChange={handletTypeInputChange}/>
                    </div>
                    <button onClick={searchByRefN}>Search</button>
                </form>
            </Modal>
            <Modal ref={addModalRef}>
                <div>
                    <h1>Add new product</h1>
                    <button onClick={closeAddModal}className="close">Close</button>
                    <form className="form">
                        <div>
                            <label htmlFor="catalog_number">*Catalog number</label>
                            <input type="text" name="catalog_number" placeholder="Catalog number" onChange={handleAddInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="name">*Product name</label>
                            <input type="text" name="name" placeholder="Product name" onChange={handleAddInputChange}/>
                        </div>
                        {/* <div>
                            <label htmlFor="type">Product type</label>
                            <select name="type" onChange={handleAddInputChange}>
                                <option defaultValue="">Select a product type</option>
                                <option value="enzime">Enzimes</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="consumable">Consumables</option>
                                <option value="laboratory">laboratory</option>
                                <option value="garment">Garments</option>
                                <option value="stationery">Stationery</option>
                                <option value="plastic">Plastics</option>
                                <option value="chemical">Chemicals</option>
                                <option value="glass">Glass</option>
                                <option value="other">Others</option>
                            </select>
                        </div> */}
                        <div>
                            <label htmlFor="trading_house">Trading house</label>
                            <input type="text" name="trading_house" placeholder="Trading house" onChange={handleAddInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="reference_number">Reference number</label>
                            <input type="text" name="reference_number" placeholder="Reference number" onChange={handleAddInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="price">*Price</label>
                            <input type="text" name="price" placeholder="Price" onChange={handleAddInputChange}/>
                        </div>
                        <div>
                            <label htmlFor="information">Product information</label>
                            <input type="text" name="information" placeholder="Information" onChange={handleAddInputChange}/>
                        </div>
                    </form>
                    <p>The fields marked with * are required</p>
                    <button onClick={addNewProduct}>Add product to the list</button>
                </div>
            </Modal>
        </div>
    )
}

export default ProductSection