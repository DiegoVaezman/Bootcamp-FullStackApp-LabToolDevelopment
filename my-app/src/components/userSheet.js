import React from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import apiURL from '../services/apiURL'
import { useState, useEffect } from 'react'

function UserSheet(props) {
    // const user = props.location.data.user
    const [data, setData] = useState({})

    //CONSIGUIENDO LA DATA DE USUARIO
    async function getData() {
        const dataBase = await axios.get(`${apiURL}user/${props.match.params.id}`);
        setData(dataBase.data)
    }
    useEffect(() => {
        let token = localStorage.getItem("labToolUser");
        props.autoLogin(token)
        getData()
    }, [])


    return (
        <div className="gridSection"> 
            <div className="back">
                <Link className="Link" to="/users">Back</Link>
            </div>
            <div className="sheetBody">
                <div className="sheetRequestName">
                    <h1>{data.fullname}</h1>
                </div>
                <div className="sheetInfo">
                    <p>E-mail: {data.email}</p>
                    <p>Position: {data.position}</p>
                    <p>Rol: {data.rol}</p>
                </div>
                {/* <label for="toggle" class=""></label>
                <input type="checkbox" />
                <span class="slider round"></span> */}
            </div>
        </div>
    )
}






export default UserSheet