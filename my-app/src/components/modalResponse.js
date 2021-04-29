import React, { forwardRef, useImperativeHandle } from 'react';
import {useState} from 'react'
import ReactDOM from "react-dom"

const ModalResponse = forwardRef((props, ref) => {

    const [display, setDisplay] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            openModal: () => open(),
            closeModal: () => close()
        }
    });
    const open = () => {
        setDisplay(true);
    };
    const close = () => {
        setDisplay(false)
    };

    if (display) {
        return (
            ReactDOM.createPortal(
                <div className={"modal-wrapper"}>
                    
                        {props.children}
                    
                </div>, document.getElementById("modal-root")
            )
        )
    };
    return null;
}
)

export default ModalResponse