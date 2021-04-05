import React from 'react';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiURL from '../services/apiURL'
import axios from 'axios';

function RequestsListItem(props) {

    //CONSIGUIENDO NOMBRE DE PRODUCTO
    const [productData, setProductData] = useState({
        data: {name:""}
    })
    useEffect(() => {
        async function getProductName() {
            const dataBase = await axios.get(`${apiURL}product/${props.order.product}`);
            setProductData(dataBase)
        }
        getProductName()
    },[])


    //CONSIGUIENDO MENSAJES
    const [commentData, setCommentData] = useState({
        data: {msg: ""}
    })
    useEffect(() => {
        async function getComment() {
            const dataBase = await axios.get(`${apiURL}comment/${props.order._id}`);
            setCommentData(dataBase)
        }
        getComment()
    },[])


    return (
        <Link to={{pathname:`/requests/requestsheet/${props.order._id}`, data:props, productData:productData.data}} >
            <div className="productListItem" >
                <div>
                    <div>
                        {productData.data.name}
                    </div>
                    <div>
                        <img className="img comentario"></img>
                        <p>{commentData.data.msg === "No comments" ? "0 com" : `${commentData.data.length} com`}</p>
                    </div>
                </div>
                <div className="productInfo">
                    <p>Amount: {props.order.amount} units</p>
                    <p>User:{"ordennte"}</p>
                    <p>Date:{props.order.date.substring(0,10)}</p>
                    {(props.order.status === "waiting") && <p style={{color: "orange"}}>{props.order.status}</p>}
                    {(props.order.status === "validated") && <p style={{color: "green"}}>{props.order.status}</p>}
                    {(props.order.status === "received") && <p style={{color: "blue"}}>{props.order.status}</p>}
                    {(props.order.status === "rejected") && <p style={{color: "red"}}>{props.order.status}</p>}
                </div>
            </div>
         </Link>
    )
}

export default RequestsListItem