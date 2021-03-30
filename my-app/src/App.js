import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
// import SignupPage from './pages/signup'
// import SigninPage from './pages/signin'
import Main from './components/main'
import Header from './components/header';
import ProductSection from './components/productSection';

import Navbar from './components/navbar';
import Register from './components/register'
import ProductSheet from './components/productSheet';


function App() {

    const notoken = "si token"
    if (notoken == "no token") {
        return <Register />
    }

    return (
        <Router>
        <div className="App">
            <Header />
            <Switch>
                <Route path="/products" exact>
                <ProductSection />
                </Route>
                <Route path="/products/productsheet/:id" component={ProductSheet}>
                
                </Route>

            </Switch>
            <Navbar />
        </div>
        </Router>
        

    )
}

export default App