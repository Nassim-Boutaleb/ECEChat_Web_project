import React from 'react'
import Navbar from './Navbar'
import Main from './Main'

const styles = {
    root: {
      //border: '5px green solid',
      //width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      //overflow: 'hidden',
      //position: 'absolute',
      height: '100%',
      width: '100%',  // position absolue+w et h à 100% pour éviter le défilement global du navigateur
    }
  } // fin styles


const MainPage = () => {
    return (
        <div style={styles.root}>
            <Navbar/>
            <Main/>
        </div>
    );
}

export default MainPage;