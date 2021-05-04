import React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import apiURL from '../services/apiURL'
import RequestsListItem from './requestsListItem'

function RequestsSection(props) {

    //ESTADOS
    const [loading, setLoading] = useState(true)
    const [dataNewRequests, setDataNewRequests] = useState([])
    const [dataValidatedRequests, setdataValidatedRequests] = useState([])
    const [dataReceivedRequests, setdataReceivedRequests] = useState([])
    const [dataAllRequests, setdataAllRequests] = useState([])
    const [selectedList, setSelectedList] = useState({
        new: true
    })

    //CONSIGUIENDO LAS DATAS DE PEDIDOS SEGÚN ESTADO DESDE DB
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
        setLoading(false)
    }
    useEffect(() => {
        let token = localStorage.getItem("labToolUser");
        props.autoLogin(token)
        getData()
    },[])

    return (
        <div className="gridSection grid">
            <div className="selectVar filter">
                <input type="radio" id="radioNew" name="radioVar" value="new" onClick={() => setSelectedList({new : true})} defaultChecked/>
                <label htmlFor="radioNew"><b>New</b></label>
                <input type="radio" id="radioValidate" name="radioVar" value="validated" onClick={() => setSelectedList({validated : true})} />
                <label htmlFor="radioValidate"><b>Validated</b></label>
                <input type="radio" id="radioReceived" name="radioVar" value="received" onClick={() => setSelectedList({received : true})} />
                <label htmlFor="radioReceived"><b>Received</b></label>
                <input type="radio" id="radioAll" name="radioVar" value="all" onClick={() => setSelectedList({all : true})} />
                <label htmlFor="radioAll"><b>All</b></label>
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