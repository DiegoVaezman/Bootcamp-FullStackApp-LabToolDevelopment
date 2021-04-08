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

    //CONSIGUIENDO NOMBRE DE USUARIO
    const [userData, setUserData] = useState({
        fullname: ""
    })
    useEffect(() => {
        async function getUser() {
            const dataBase = await axios.get(`${apiURL}user/${props.order.user}`);
            setUserData(dataBase.data)
        }
        getUser()
    },[])

    console.log(productData.data)
    return (
        <Link className="txtNoDeco" to={{pathname:`/requests/requestsheet/${props.order._id}`, data:props, productData:productData.data}} >
            <div className="productListItem" >
                <div className="productListItemHead">
                    <div className="productName">
                        {productData.data.name}
                    </div>
                    <div className="flex-row">
                        <p><b>{commentData.data.msg === "No comments" ? "0" : `${commentData.data.length}`}</b></p>
                        <img className="commentImg" src="../../img/comment_img.png"></img>
                    </div>
                </div>
                <div className="productInfo">
                    <p><b>Amount: </b>{props.order.amount}</p>
                    <p>{userData.fullname}</p>
                    <p>{props.order.date.substring(0,10)}</p>
                    <div ClassName="requestListItemStatus">
                        {(props.order.status === "waiting") && <p style={{color: "orange"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "validated") && <p style={{color: "green"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "received") && <p style={{color: "blue"}}><b>{props.order.status}</b></p>}
                        {(props.order.status === "rejected") && <p style={{color: "red"}}><b>{props.order.status}</b></p>}
                    </div>
                </div>
            </div>
         </Link>
    )
}

export default RequestsListItem