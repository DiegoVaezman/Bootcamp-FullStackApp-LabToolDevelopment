import React from 'react';

function ErrorComponent(props) {
    return (
        <div>
            <p>UPS!</p>
            <p>logo</p>
            <div>{props.child}</div>
        </div>
    )
}

export default ErrorComponent