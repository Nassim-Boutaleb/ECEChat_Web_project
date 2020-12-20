import React, {useState} from 'react';
import './App.css';
import Header from './application/Header'
import Footer from './application/Footer'
import Main from './application/Main'
import MainPage from './application/MainPage'
import Signup from './login/Signup'
import Login from './login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import NotFound from './NotFound'

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    padding: '50px',
    border: '1px red solid'
  }
} // fin styles


/*export default () => (
        <div className="App" style={styles.root}>
            <Header/>
            <Main/>
            <Footer/>
        </div>
);  // fin export default*/

/*export default () => (
  <div className="App" style={styles.root}>
      <Login/>
  </div>
);  // fin export default*/

export default () => (
<div className="App" > {/*style={styles.root}>*/}
      <Switch>
        <Route exact path ='/' component={Login} />
        <Route exact path ='/signup' component={Signup} />
        <PrivateRoute exact path ='/Main' component={MainPage} />
        <Route component={NotFound} />
      </Switch>
  </div>
);  // fin export default
