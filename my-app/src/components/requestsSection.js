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

function RequestsSection(props) {

    
    const [loading, setLoading] = useState(true)

    //CONSIGUIENDO LAS DATAS DE PEDIDOS SEGÚN ESTADO DESDE DB
    const [dataNewRequests, setDataNewRequests] = useState([])
    const [dataValidatedRequests, setdataValidatedRequests] = useState([])
    const [dataReceivedRequests, setdataReceivedRequests] = useState([])
    const [dataAllRequests, setdataAllRequests] = useState([])

    async function getData() {
        console.log("pasa por conseguir dara de rquests")
        //waiting
        const dataNew = await axios.get(`${apiURL}order/waiting`);
        console.log(dataNew)
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
        setLoading(false)
    }
    useEffect(() => {
        getData()
    },[])



    //ELIGIENDO QUE LISTA MOSTRAR
    const [selectedList, setSelectedList] = useState({
        new: true
    })

    return (
        <div className="gridSection grid">
            <div className="selectVar filter">
                <input type="radio" id="radioNew" name="radioVar" value="new" onClick={() => setSelectedList({new : true})} defaultChecked/>
                <label for="radioNew"><b>New</b></label>
                <input type="radio" id="radioValidate" name="radioVar" value="validated" onClick={() => setSelectedList({validated : true})} />
                <label for="radioValidate"><b>Validated</b></label>
                <input type="radio" id="radioReceived" name="radioVar" value="received" onClick={() => setSelectedList({received : true})} />
                <label for="radioReceived"><b>Received</b></label>
                <input type="radio" id="radioAll" name="radioVar" value="all" onClick={() => setSelectedList({all : true})} />
                <label for="radioAll"><b>All</b></label>
            </div>
            
            <div className="list">
                {loading ? 
                <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                :
                selectedList.new === true && dataNewRequests.length > 0 ? 
                    dataNewRequests.reverse().map((item, index) => {
                        return <RequestsListItem order={item} key={index} />
                    })
                :
                selectedList.validated === true && dataValidatedRequests.length > 0 ? 
                    dataValidatedRequests.map((item, index) => {
                        return <RequestsListItem order={item} key={index} />
                    })
                :
                selectedList.received === true && dataReceivedRequests.length > 0 ?
                    dataReceivedRequests.map((item, index) => {
                        return <RequestsListItem order={item} key={index} />
                    })
                :
                selectedList.all === true && dataAllRequests.length > 0 ?
                    dataAllRequests.map((item, index) => {
                        return <RequestsListItem order={item} key={index} />
                    })
                : <p align="center">There is no request</p>
                }
            </div>
            <div className="addProductBtn">
                <Link className="Link" to="/products"><b>+ Add new request</b></Link>
            </div>
        </div>
    )
}

export default RequestsSection