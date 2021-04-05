import React from 'react';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiURL from '../services/apiURL'
import axios from 'axios';



function StockListItem(props) {

    //CONSIGUIENDO NOMBRE DE PRODUCTO
    const [productData, setProductData] = useState({
        data: {name:""}
    })
    useEffect(() => {
        async function getProductName() {
            const dataBase = await axios.get(`${apiURL}product/${props.item.product}`);
            setProductData(dataBase)
        }
        getProductName()
    },[])

   console.log(props)
    return (
        <Link to={{pathname:`/stock/itemsheet/${props.item._id}`, data:props, productData:productData.data}} >
            <div className="productListItem" >
                    <div>{productData.data.name}</div>
                    <div className="productInfo">
                        {props.item.status === "In stock" ? <p style={{color: "green"}}>{props.item.status}</p> : <p style={{color: "red"}}>{props.item.status}</p>}
                        {props.item.limit === true && <p>Limit controled</p>}
                        {props.item.request === true && <p style={{color: "orange"}}>Currently ordered</p>}
                    </div>
                    <div>{props.item.amount}</div>
            </div>
         </Link>
    )
}

export default StockListItem