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
        <Link className="txtNoDeco" to={{pathname:`/stock/itemsheet/${props.item._id}`, data:props, productData:productData.data}} >
            <div className="productListItem" >
                <div className="itemList">
                    <div className="itemInfo">
                        <div className="productName" ><p style={{color: "rgb(46, 46, 46)"}}>{productData.data.name}</p></div>
                        <div className="itemList">
                            <div className="flex-row">
                                {props.item.status === "In stock" ? <p style={{color: "rgb(144, 212, 41)", marginRight:"20px"}}>{props.item.status}</p> : <p style={{color: "rgb(206, 0, 0)", marginRight:"20px"}}>{props.item.status}</p>}
                                {props.item.control === true && <p style={{color: "rgb(46, 46, 46)"}}>Limit controled</p>}
                            </div>
                            {props.item.request === true && <p style={{color: "orange"}}>Currently ordered</p>}
                        </div>
                    </div>
                    <div><p style={{fontSize: "30px", paddingRight:"10px", color: "rgb(46, 46, 46)"}}>{props.item.amount}</p></div>
                </div>
            </div>
         </Link>
    )
}

export default StockListItem