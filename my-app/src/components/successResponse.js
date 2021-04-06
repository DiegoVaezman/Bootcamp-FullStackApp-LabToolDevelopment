import React from 'react';

function SuccessComponent(props) {
    return (
        <div className="commonSuccess">
            <p>GOOD!</p>
            <p>logo</p>
            <div>{props.child}</div>
        </div>
    )
}

export default SuccessComponent