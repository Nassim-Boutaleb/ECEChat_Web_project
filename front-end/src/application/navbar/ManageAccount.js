import React,{useState} from 'react'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import api from './../../api'
import UserAccountManager from './UserAccountManager'


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
    
  };

const ManageAccount = ({userConnected}) => {
    
    // Gestion du menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const isMenuOpen = Boolean(anchorEl);
//____________________________________________________
    // Gestion du sous-menu modifier les données utilisateur


//_________________________________________________________
    // Gestion de la déconnexion
    const logout = () => {
        handleMenuClose();
        api.logout();
    }

//_____________________________________________________________

    // Le menu
    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id='ManageLoginMenu'
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Modifier mes informations personnelles</MenuItem>
          <MenuItem onClick={logout}>Déconnexion</MenuItem>
        </Menu>
    );
    
    return (
        <div>
            <IconButton
                edge="end"
                aria-label="Gerer votre compte"
                aria-controls='ManageLoginMenu'
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle fontSize='large' />
            </IconButton>
            {renderMenu}
        </div>
      );
}

export default ManageAccount;