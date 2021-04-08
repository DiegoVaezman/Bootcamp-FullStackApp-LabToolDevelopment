import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import {Redirect, Link, Route, Switch} from 'react-router-dom'
import Modal from "./modal"
import ModalResponse from './modalResponse';
import SuccessResponse from "./successResponse"
import ErrorResponse from "./errorResponse"
import ProductListItem from './productListItem'
import apiURL from '../services/apiURL'
import RequestsListItem from './requestsListItem'

function RequestsSection() {

    
    

    //CONSIGUIENDO LAS DATAS DE PEDIDOS SEGÚN ESTADO DESDE DB
    const [dataNewRequests, setDataNewRequests] = useState([])
    const [dataValidatedRequests, setdataValidatedRequests] = useState([])
    const [dataReceivedRequests, setdataReceivedRequests] = useState([])
    const [dataAllRequests, setdataAllRequests] = useState([])

    async function getData() {
        console.log("pasa por conseguir dara de rquests")
        //waiting
        const dataNew = await axios.get(`${apiURL}order/waiting`);
        setDataNewRequests(dataNew.data)
       
        //validated
        const dataValidated = await axios.get(`${apiURL}order/validated`);
        setdataValidatedRequests(dataValidated.data)

        //received
        const dataReceived = await axios.get(`${apiURL}order/received`);
        setdataReceivedRequests(dataReceived.data)
        //all
        const dataAll = await axios.get(`${apiURL}order/`);
        setdataAllRequests(dataAll.data)

    }
    useEffect(() => {
        getData()
    },[])



    //ELIGIENDO QUE LISTA MOSTRAR
    const [selectedList, setSelectedList] = useState({
        new: true
    })

    console.log(dataNewRequests.reverse())
    return (
        <div className="gridSection grid">
            <div className="selectVar filter">
                <input type="radio" id="radioNew" name="radioVar" value="new" onClick={() => setSelectedList({new : true})} defaultChecked/>
                <label for="radioNew"><b>New</b></label>
                <input type="radio" id="radioValidate" name="radioVar" value="validated" onClick={() => setSelectedList({validated : true})} />
                <label for="radioValidate"><b>Validate</b></label>
                <input type="radio" id="radioReceived" name="radioVar" value="received" onClick={() => setSelectedList({received : true})} />
                <label for="radioReceived"><b>Received</b></label>
                <input type="radio" id="radioAll" name="radioVar" value="all" onClick={() => setSelectedList({all : true})} />
                <label for="radioAll"><b>All</b></label>

                {/* <button className="selectVarButton" onClick={() => setSelectedList({new : true})}>New</button>
                <button onClick={() => setSelectedList({validated : true})}>Validated</button>
                <button onClick={() => setSelectedList({received : true})}>Received</button>
                <button onClick={() => setSelectedList({all : true})}>All</button> */}
            </div>

            {(selectedList.new === true && dataNewRequests.length > 0) && 
            <div className="list">
                {dataNewRequests.reverse().map((item, index) => {
                    return <RequestsListItem order={item} key={index} />
                })}
            </div>}

            {(selectedList.validated === true && dataValidatedRequests.length > 0) && 
            <div className="list">
                {dataValidatedRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} />
                })}
            </div>}

            {(selectedList.received === true && dataReceivedRequests.length > 0) && 
            <div className="list">
                {dataReceivedRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} />
                })}
            </div>}

            {(selectedList.all === true && dataAllRequests.length > 0) && 
            <div className="list">
                {dataAllRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} />
                })}
            </div>}
  
            <div className="addProductBtn">
                <Link className="Link" to="/products">Add new request</Link>
            </div>
        </div>
    )
}

export default RequestsSection