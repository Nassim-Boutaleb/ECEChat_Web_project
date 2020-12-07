import React, {useState} from 'react';
import './App.css';
import Header from './application/Header'
import Footer from './application/Footer'
import Main from './application/Main'
import Signup from './login/Signup'
import Login from './login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    padding: '50px',
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
  <div className="App" style={styles.root}>
      <Switch>
        <Route exact path ='/' component={Login} />
        <Route exact path ='/signup' component={Signup} />
        <Route exact path ='/Main' component={Main} />
      </Switch>
  </div>
);  // fin export default
