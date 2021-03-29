import { PromiseProvider } from 'mongoose';
import React from 'react';
import {useState} from 'react'

const Modal = (props) => {

    const [display, setDisplay] = useState(true);

    const open = () => {
        setDisplay(true)
    }
    const close = () => {
        console.log("close")
        setDisplay(false)
    }

    if (display) {
        return (
            <div className={"modal-wrapper"}>
                ajdbqieugbqierbvqiebviqeb
                <div onClick={close} className={"modal-backdrop"} />
                <button onClick={close} className="close-btn">Closeeeeeeeeeee</button>
                <div className={"modal-box"}>
                    
                    {props.children}
                </div>
            </div>
        )
    }
    return null;
}

export default Modal