import React from 'react';
import { Link } from 'react-router-dom'



function UserSheet(props) {

    const user = props.location.data.user
    return (
        <div className="gridSection"> 
            <div className="back">
                <Link className="Link" to="/user">Back</Link>
            </div>
            <div className="sheetBody">
                <div className="sheetRequestName">
                    <h1>{user.fullname}</h1>
                </div>
                <div className="sheetInfo">
                    <p>E-mail: {user.email}</p>
                    <p>Position: {user.position}</p>
                    <p>Rol: {user.rol}</p>
                </div>
                {/* <label for="toggle" class=""></label>
                <input type="checkbox" />
                <span class="slider round"></span> */}
            </div>
        </div>
    )
}






export default UserSheet