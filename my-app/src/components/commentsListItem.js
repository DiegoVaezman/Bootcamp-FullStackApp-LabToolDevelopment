import React from 'react';



function CommentListItem(props) {

    return (
            <div className="productListItem" >
                
                    <div>
                    <div>{"nombre del usuario enlazado al comentario"}</div>
                    <div>{props.comment.date}</div>
                    </div>
                    <div className="productInfo">
                    {props.comment.text}
                    </div>
            </div>
    )
}

export default CommentListItem