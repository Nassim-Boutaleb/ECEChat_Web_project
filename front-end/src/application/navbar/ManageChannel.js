import React,{useState} from 'react'
import IconButton from '@material-ui/core/IconButton';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ChannelNameManager from './ChannelNameManager'


const styles = {
    wrapper: {
      border: '1px solid black',
      borderRadius: '30px'
    },
    
  };

const ManageChannel = () => {
    // Gestion du menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const isMenuOpen = Boolean(anchorEl);

//_______________________________________________
    // Gestion menu nom du channel
    const [ChannelNameOpen, setChannelNameOpen] = React.useState(false);

    const handleChannelNameOpen = () => {
        setChannelNameOpen(true);
        handleMenuClose();
    };
  
    const handleChannelNameClose = () => {
        setChannelNameOpen(false);
    };

//________________________________________________________
    //Gestion menu des permissions utilisateurs


//__________________________________________________________
    
    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id='ManageChannelMenu'
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
            <MenuItem onClick={handleChannelNameOpen}>Modifier nom du channel</MenuItem>
                <ChannelNameManager open={ChannelNameOpen} handleClose={handleChannelNameClose} />
            <MenuItem onClick={handleMenuClose}>Gerer les utilisateurs</MenuItem>
            <MenuItem onClick={handleMenuClose}>Supprimer le channel</MenuItem>
        </Menu>
    );
    
    return (
        <div styles={styles.wrapper}>
            <IconButton
                edge="end"
                aria-label="Gerer votre compte"
                aria-controls='ManageChannelMenu'
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <SettingsApplicationsIcon fontSize='large' />
                Gerer le channel
            </IconButton>
            {renderMenu}
        </div>
      );
}

export default ManageChannel;