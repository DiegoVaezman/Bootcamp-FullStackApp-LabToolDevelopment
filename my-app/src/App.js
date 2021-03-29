import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, Route} from "wouter";
import './App.css';
// import SignupPage from './pages/signup'
// import SigninPage from './pages/signin'
import ProductSection from './components/productSection';
import apiURL from './services/apiURL'


function App() {

    

    return (
        <div className="App">
            <div className="header">
                <p>LOGO Darwin Lab</p>
                <p>Marie Curie</p>
            </div>
            <ProductSection 
            // data={products} 
            />
            <div className="nav">
                <p>HOME</p>
                <p>PRODUCTS</p>
                <p>REQUESTS</p>
                <p>STOCK</p>
            </div>
        </div>
        

    )
}

export default App