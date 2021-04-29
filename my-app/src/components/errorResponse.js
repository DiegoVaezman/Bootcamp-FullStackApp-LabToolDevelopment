import React from 'react';

function ErrorComponent(props) {
    return (
        <div className="commonError">
            <img src='../../img/sclamation.png' alt="Sclamation_img" />
            <p>Something was wrong</p>
            <div>{props.child}</div>
        </div>
    )
}

export default ErrorComponent