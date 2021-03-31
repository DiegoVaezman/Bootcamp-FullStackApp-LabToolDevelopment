import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import './App.css';
// import SignupPage from './pages/signup'
// import SigninPage from './pages/signin'
import Home from './components/home'
import Header from './components/header';
import ProductSection from './components/productSection';

import Navbar from './components/navbar';
import Register from './components/register'
import ProductSheet from './components/productSheet';
import Signup from './components/signup';
import Signin from './components/signin';
import User from './components/user';
import UserSheet from './components/userSheet';
import RequestsSection from './components/requestsSection';


function App() {

    
    // if (!axios.defaults.headers.common.Authorization) {
    //     return (<Redirect to="/" />)
    // }
    // if (!localStorage.getItem('labToolUser')) {
    //     return (<Register /> )
    // }

    // const islogged = () => {}

    return (
        <Router>
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    <Register />
                </Route>
                <Route path="/signup" exact>
                    <Signup />
                </Route>
                <Route path="/signin" exact>
                    <Signin />
                </Route>
                
                <Route>
                    <Header />
                    <Switch>
                        <Route path="/home" component={Home} />

                        <Route path="/user" exact component={User} />
                        <Route path="/user/usersheet/:id" component={UserSheet} />

                        <Route path="/products" exact component={ProductSection} />
                        <Route path="/products/productsheet/:id" component={ProductSheet} />

                        <Route path="/requests" exact component={RequestsSection} />
                        
                
                    </Switch>
                    <Navbar />
                </Route>
            </Switch>
        </div>
        </Router>
        

    )
}

export default App