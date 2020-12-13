import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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

const Navbar = ({handleDrawerOpen}) => {
    return (
        <div style={styles.root}>
          <AppBar position="static" style={styles.navbar}>
            <Toolbar>
              <IconButton edge="start"  color="inherit" aria-label="menu" style={styles.menuButton} onClick={handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
              <span style={styles.title}> </span>
              <Button color="inherit" style={styles.login}>Gerer mon compte (non fonctionnel)</Button>
            </Toolbar>
          </AppBar>
        </div>
      );
}

export default Navbar;