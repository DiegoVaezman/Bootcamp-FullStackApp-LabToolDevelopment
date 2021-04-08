import React from 'react';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiURL from '../services/apiURL'
import axios from 'axios';



function CommentListItem(props) {
        
        //CONSIGUIENDO EL USUARIO QUE HIZO EL COMENTARIO
        const [userName, setUserName] = useState({
                data: {fullname:""}
        })
        async function getUserName() {
                console.log(props.comment.owner)
                const dataBase = await axios.get(`${apiURL}user/${props.comment.owner}`);
                setUserName(dataBase)
                console.log(dataBase)
        }
        useEffect(() => {
                getUserName()
        },[])

        console.log(userName.data.fullname)
    return (
        <div className="commentsListItem" >
                <div className="productListItemHead">
                        <div>
                                <b>@{userName.data.fullname}</b>
                        </div>
                        <div>
                                {props.comment.date.substring(0,10)}
                        </div>
                </div>
                <div className="productInfo">
                        {props.comment.text}
                </div>
        </div>
    )
}

export default CommentListItem