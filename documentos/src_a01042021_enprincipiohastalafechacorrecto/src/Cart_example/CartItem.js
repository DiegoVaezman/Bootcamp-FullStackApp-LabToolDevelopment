import React from 'react';
import './CartItem.css'

function CartItem({id, product, price, qty, updateQty}) {

    const addOne = () => {
        updateQty(id, qty + 1)
    }
    const substractOne = () => {
        updateQty(id, qty - 1)
    }

    return (
        <div className="CartItem">
            <div>{product}</div>
            <div>${price}</div>
            <div>
            <button onClick={substractOne} disabled={qty <= 1}>-</button>
            {qty}
            <button onClick={addOne}>+</button>
            </div>
            <div>
            Total: {qty * price}
            </div>
        </div>
    )
}
    

export default CartItem;