import React from 'react';
import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import apiURL from '../services/apiURL'
import axios from 'axios';
import formatDate from '../services/formatDate'


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


        //BORRANDO COMENTARIO
        const deleteComment = () => {
                console.log(props.comment._id)
                axios.delete(`${apiURL}comment/deletecomment/${props.comment._id}`)
                .then(res => {
                    console.log("comentario eliminado")
                    
                    props.setchange()
                })
                .catch(error => {
                    console.log(error)
                });
        }
        console.log(props.user.fullname)
    return (
        <div className="commentsListItem" >
                <div className="productListItemHead">
                        <div>
                                <b>@{userName.data.fullname}</b>
                        </div>
                        <div>
                                <p style={{fontSize:"13px"}}>{`${formatDate(props.comment.date)}`}</p>
                        </div>
                </div>
                <div className="productInfo">
                        {props.comment.text}
                        {userName.data.fullname ==  props.user.fullname && <div id="garbage"><img className="garbage"src="../../img/garbage_img.png" onClick={() => deleteComment()}/></div>}
                </div>
        </div>
    )
}

export default CommentListItem