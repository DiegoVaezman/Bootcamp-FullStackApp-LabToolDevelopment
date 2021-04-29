import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse"
import ErrorResponse from "./errorResponse"
import StockListItem from './stockListItem'
import apiURL from '../services/apiURL'

function StockSection(dataBase){

    // VENTANAS MODALES
    // const searchModalRef = React.useRef();
    const responseModalRef = React.useRef();
    // const openSearchModal = () => {
    //     searchModalRef.current.openModal()
    // };
    // const openResponseModal = () => {
    //     responseModalRef.current.openModal()
    // };
    // const closeSearchModal = () => {
    //     searchModalRef.current.closeModal()
    // };
    const closeResponseModal = () => {
        setResponse({
            error: false,
            success: false,
            msg: ""
        })
        responseModalRef.current.closeModal()
    };

    //ESTADOS
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [response, setResponse] = useState({
        success: false,
        error: false,
        msg: ""
    })
    
    //CONSIGUIENDO LA DATA DE STOCK DESDE DB
    async function getData() {
        const dataBase = await axios.get(`${apiURL}stock/`);
        setLoading(false)
        setData(dataBase.data)
        setDataFiltered(dataBase.data)
    }
    useEffect(() => {
        getData()
    },[])

    //FILTRANDO LA DATA
    // const [inputValue, setInputValue] = useState({
    //     byname: "",
    //     bycatn: "",
    //     byrefn:""
    // })
    // const handletTypeInputChange = (event) => {
    //     setInputValue({
    //         ...inputValue,
    //         [event.target.name] : event.target.value
    //     })
    // }
    // const searchByName = (event) => {
    //     event.preventDefault();
    //     const name = inputValue.byname;
    //     setDataFiltered(data.filter(item => item.name.toLowerCase().includes(name)));
    //     closeSearchModal()
    // }
    // const searchByCatN = (event) => {
    //     event.preventDefault();
    //     const catN = String(inputValue.bycatn);
    //     setDataFiltered(data.filter(item => String(item.catalog_number).includes(catN)));
    //     closeSearchModal()
    // }
    // const searchByRefN = (event) => {
    //     event.preventDefault();
    //     const refN = inputValue.byrefn;
    //     setDataFiltered(data.filter(item => item.reference_number.toLowerCase().includes(refN)));
    //     closeSearchModal()
    // }
    // const searchByType = (event) => {
    //     const type = event.target.value;
    //     if (type === "All") {
    //         setDataFiltered(data)
    //     } else {
    //         setDataFiltered(data.filter(item => item.type === type))
    //     }
    // }
    
    return (
        <div className="gridSection grid">
            {/* FILTRADO DE STOCK. POR AHORA NO IMPLEMENTADO HASTA CONSEGUIR ACCEDER A PRODUCT DOC DESDE PRODUCT_ID DEL ITEM DOC (modificar estilo listStock para incluir el filtro)*/}
            {/* <div className="filter">
                <select id="select" name="bytype" onClick={searchByType}>
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
                <button className="button1" onClick={openSearchModal}>Advanced Search</button>
            </div> */}

            <div className="listStock">
                {loading ? 
                    <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    : dataFiltered.length > 0 ?
                    dataFiltered.map((item, index) => {
                        return <StockListItem item={item} key={index} />
                    })
                    : <p align="center">There is no item</p>
                }
            </div>
            

            {/* <Modal ref={searchModalRef}>
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
            </Modal> */}
            {response.success === true && 
                <ModalResponse ref={responseModalRef} response="true">
                    <div>
                        <SuccessResponse />
                        <p>{response.msg}</p>
                        <button onClick={closeResponseModal}className="close">Close</button>
                    </div>
                </ModalResponse>
            }
            {response.error === true && 
                <ModalResponse ref={responseModalRef}>
                    <div>
                        <ErrorResponse />
                        <p>{response.msg.msg}</p>
                        <button onClick={closeResponseModal}className="close">Close</button>
                    </div>
                </ModalResponse>
            }
        </div>
    )
}

export default StockSection