import React from 'react';
import './App.css';
import Cart from './Cart';
import {useState} from 'react'

const items = [
    {id: 1, product: 'papas', price: 2.34, qty: 2 },
    {id: 2, product: 'queso', price: 6.56, qty: 3 },
    {id: 3, product: 'servesa', price: 3.23, qty: 5 },
]


function App() {
    return (
        <div>
           <Cart initialItems={items}/>
        </div>
    )
}

export default App