import React from 'react';
import apiURL from '../services/apiURL'
import axios from 'axios';
import formatDate from '../services/formatDate'


function CommentListItem(props) {
        
        //BORRANDO COMENTARIO
        const deleteComment = () => {
                axios.delete(`${apiURL}comment/deletecomment/${props.comment._id}`)
                .then(res => {
                        props.setchange()
                })
                .catch(error => {
                        console.log(error.response)
                });
        }
        return (
                <div className="commentsListItem" >
                        <div className="productListItemHead">
                                <div>
                                        <b>@{(props.comment.owner != null) ? props.comment.owner.fullname : "No user"}</b>
                                </div>
                                <div>
                                        <p style={{fontSize:"13px"}}>{`${formatDate(props.comment.date)}`}</p>
                                </div>
                        </div>
                        <div className="productInfo">
                                {props.comment.text}
                                {props.comment.owner != null && props.comment.owner.fullname === props.user.fullname && <div id="garbage"><img alt="garbage_img" className="garbage"src="../../img/garbage_img.png" onClick={() => deleteComment()}/></div>}
                        </div>
                </div>
        )
}

export default CommentListItem