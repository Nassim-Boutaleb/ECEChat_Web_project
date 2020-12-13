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
      width: '100%',  // w et h à 100% pour éviter le défilement global du navigateur
    }
  } // fin styles


const MainPage = () => {

  // Drawer
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

    return (
        <div style={styles.root}>
            <Navbar handleDrawerOpen={handleDrawerOpen}/>
            <Main open={open} onClick={handleDrawerClose} handleDrawerClose={handleDrawerClose} />
        </div>
    );
}

export default MainPage;