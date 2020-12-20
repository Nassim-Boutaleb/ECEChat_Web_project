import React from 'react';
import './App.css';
import MainPage from './application/MainPage'
import Signup from './login/Signup'
import Login from './login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import NotFound from './NotFound'




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
