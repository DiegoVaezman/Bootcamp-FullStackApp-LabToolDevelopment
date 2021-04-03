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

    const handlerChange = () => {
        getData()
        }
    

    //CONSIGUIENDO LAS DATAS DE PEDIDOS SEGÚN ESTADO DESDE DB
    const [dataNewRequests, setDataNewRequests] = useState([])
    const [dataValidatedRequests, setdataValidatedRequests] = useState([])
    const [dataReceivedRequests, setdataReceivedRequests] = useState([])
    const [dataAllRequests, setdataAllRequests] = useState([])

    async function getData() {
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


    return (
        <div>
            <div>
                <button onClick={() => setSelectedList({new : true})}>New</button>
                <button onClick={() => setSelectedList({validated : true})}>Validated</button>
                <button onClick={() => setSelectedList({received : true})}>Received</button>
                <button onClick={() => setSelectedList({all : true})}>All</button>
            </div>
            {/* <Switch >
            <Route path="requests/newrequests"> */}
            
            {(selectedList.new === true && dataNewRequests.length > 0) && 
            <div className="list">
                {dataNewRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} handlerChange={handlerChange} />
                })}
            </div>}

            
            {/* </Route>
            <Route path="requests/validatedrequests"> */}
            {(selectedList.validated === true && dataValidatedRequests.length > 0) && 
            <div className="list">
                {dataValidatedRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} handlerChange={handlerChange} />
                })}
            </div>}
            {/* </Route>
            <Route path="requests/receivedrequests"> */}
            {(selectedList.received === true && dataReceivedRequests.length > 0) && 
            <div className="list">
                {dataReceivedRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} handlerChange={handlerChange} />
                })}
            </div>}
            {/* </Route>
            <Route path="requests/allrequests"> */}
            {(selectedList.all === true && dataAllRequests.length > 0) && 
            <div className="list">
                {dataAllRequests.map((item, index) => {
                    return <RequestsListItem order={item} key={index} handlerChange={handlerChange} />
                })}
            </div>}
            {/* </Route>
            </Switch> */}
            <div>
                <img></img>
                <Link to="/products">Add new request</Link>
            </div>
        </div>
    )
}

export default RequestsSection