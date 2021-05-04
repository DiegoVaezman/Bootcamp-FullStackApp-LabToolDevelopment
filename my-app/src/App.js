import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import PrivateRoute from './services/privateRoute'
import './App.css';
import Home from './components/home'
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
import StockSection from './components/stockSection';
import ItemSheet from './components/itemSheet';
import apiURL from './services/apiURL'
import setAuthToken from './services/authToken'


function App(props) {
    //ESTADOS
    // const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({})

    useEffect(() => {
        let token = localStorage.getItem("labToolUser");
        if (token) {
            autoLogin(token);
        } else {
            // setLoading(false);
        }
    },[]);

    const autoLogin = token => {

        setAuthToken(token);
        axios.get(`${apiURL}user/user`
        // , {headers: {authorization: `Bearer ${token}`}}
        )
        .then(user => {
            
            setUser({
                fullname: user.data.fullname,
                position: user.data.position,
                email: user.data.email,
                rol: user.data.rol
            })
            // setLoading(false);
        })
        .catch(err => {
            setAuthToken();
            localStorage.removeItem('labToolUser');
            // setLoading(false);
        });
    };

    const handlerUser = (userN) => {
        userN.email ? setUser(userN) : setUser({...user, fullname: userN.fullname, position: userN.position})
    }

    return (
        <Router>
        <div className="App grid">
            <Switch>
                <Route path="/" exact>
                    <Register />
                </Route>
                <Route path="/signup" exact>
                    <Signup />
                </Route>
                <Route path="/signin" render={(props) => (<Signin {...props} handlerUser={handlerUser} />)} />
                  
                <PrivateRoute>
                    <Link to="/users" className="header">
                        <div><img src="../../img/LabTool_logo_white.png" alt="LabTool_logo"/></div>
                        <h1>{user.fullname}</h1>
                    </Link>
                    <Switch>
                        <Route path="/home" component={Home} />

                        <Route path="/users" exact render={(props) => ( <User {...props} autoLogin={autoLogin} user={user} handlerUser={handlerUser}/>)} />
                        <Route path="/users/usersheet/:id" render={(props) => ( <UserSheet  {...props} autoLogin={autoLogin} /> )} />

                        <Route path="/products" exact render={(props) => ( <ProductSection {...props} autoLogin={autoLogin} /> )} />
                        <Route path="/products/productsheet/:id" exact render={(props) => ( <ProductSheet {...props} autoLogin={autoLogin} /> )} />
                        
                        <Route path="/requests" exact render={(props) => ( <RequestsSection {...props} autoLogin={autoLogin} /> )} />
                        <Route path="/requests/requestsheet/:id" exact render={(props) => ( <RequestSheet {...props} autoLogin={autoLogin} user={user} />)} />

                        <Route path="/stockitems" exact render={(props) => ( <StockSection {...props} autoLogin={autoLogin} /> )} />
                        <Route path="/stockitems/itemsheet/:id" exact render={(props) => ( <ItemSheet {...props} autoLogin={autoLogin} /> )} />

                    </Switch>
                    <Navbar />
                </PrivateRoute>
            </Switch>
        </div>
        </Router>
    )
}

export default App