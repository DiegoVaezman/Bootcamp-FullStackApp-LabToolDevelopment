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
import RequestSheet from './components/requestSheet';
import apiURL from './services/apiURL'



function App(props) {

    const token = localStorage.getItem("labToolUser")

    const [user, setUser] = useState({})

    const handlerUser = (userN) => {
        console.log(userN)
        if (userN.email) {setUser(userN)}
        else {
        console.log(userN)
        if (userN.fullname) {setUser({...user, fullname: userN.fullname})}
        if (userN.position) {setUser({...user, position: userN.position})}      //NO CONSIGO ACUTALIZAR INFO DE USUARIO ODIFICADO.
        }
    }

    console.log(user)
    
    
    // useEffect(() => {
    //     console.log("pasa por use effect")
    //     axios.get(`${apiURL}user/user`)
    //     .then(response => {
    //         setUser(response.data)
    //         console.log(response.data)
    //     })
    // }, [])


    return (
        <Router>
        <div className="App">
            {(!token) && <Redirect to="/" />}
            <Switch>
                <Route path="/" exact>
                    <Register />
                </Route>
                <Route path="/signup" exact>
                    <Signup />
                </Route>
                <Route path="/signin" render={(props) => (<Signin {...props} handlerUser={handlerUser} />)} />
                  
                <Route>
                    <Header user={user}/>
                    <Switch>
                        <Route path="/home" component={Home} />

                        <Route path="/user" exact render={(props) => ( <User {...props} user={user} handlerUser={handlerUser}/>)} />
                        <Route path="/user/usersheet/:id" component={UserSheet} />

                        <Route path="/products" exact component={ProductSection} />
                        <Route path="/products/productsheet/:id" component={ProductSheet} />

                        <Route path="/requests" exact component={RequestsSection} />
                        <Route path="/requests/requestsheet/:id" exact component={RequestSheet} />

                    </Switch>
                    <Navbar />
                </Route>
            </Switch>
        </div>
        </Router>
    )
}

export default App