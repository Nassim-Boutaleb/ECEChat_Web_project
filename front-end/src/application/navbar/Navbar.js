import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ManageAccount from './ManageAccount'
import ManageChannel from './ManageChannel'

const styles = {
    root: {
      //flexGrow: 1,
      //backgroundColor: '#373B44',
    },
    menuButton: {
      marginRight: '30px',
    },
    title: {
      flexGrow: 1,
    },
    navbar : {
        backgroundColor: 'purple'
    }
  };

// Props: handleDrawerOpen = fonction permettant d'ouvrir le drawer (composant Main)
// userConnected = objet contenant les données du user connecté
// channels = tableau contenant la liste des channels
// setChannels = MAJ des channels
// currentChannel = index du currentChannel
const Navbar = ({handleDrawerOpen,userConnected,setUserConnected,channels,setChannels,currentChannel,setCurrentChannel}) => {
    
  // ici : useEffect rechargé à chaque CurrentChannel qui regarde le rôle de userConnected
  // 0 user 1 admin 2 createru
  
  
    return (
        <div style={styles.root}>
          <AppBar position="static" style={styles.navbar}>
            <Toolbar>
              <IconButton edge="start"  color="inherit" aria-label="menu" style={styles.menuButton} onClick={handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
              <span style={styles.title}> </span>  {/*Un espace qui grossit automatiquement */}
              {
                channels.length>0 && <ManageChannel channels={channels} setChannels={setChannels} currentChannel={currentChannel} setCurrentChannel={setCurrentChannel}/>
              }
              <span style={styles.title}> </span> 
              <ManageAccount userConnected={userConnected} setUserConnected={setUserConnected}/>
            </Toolbar>
          </AppBar>
        </div>
      );
}

export default Navbar;