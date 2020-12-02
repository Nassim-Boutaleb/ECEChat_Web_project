import {useState} from 'react';
import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'

const styles = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#565E71',
    padding: '50px',
  }
} // fin styles


export default () => (
        <div className="App" style={styles.root}>
            <Header/>
            <Main/>
            <Footer/>
        </div>
);  // fin export default
