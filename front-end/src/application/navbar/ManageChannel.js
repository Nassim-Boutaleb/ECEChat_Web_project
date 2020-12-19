import React,{useState} from 'react'
import IconButton from '@material-ui/core/IconButton';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ChannelNameManager from './ChannelNameManager'
import ChannelUsersManager from './ChannelUsersManager'
import ChannelDeleteAlert from './ChannelDeleteAlert'
import api from '../../api';

const styles = {
    wrapper: {
      border: '1px solid black',
      borderRadius: '30px'
    },
    
  };

const ManageChannel = ({channels,setChannels,currentChannel,setCurrentChannel}) => {
    // Gestion du menu itself
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const isMenuOpen = Boolean(anchorEl);

//_______________________________________________
    // Gestion sous-menu nom du channel
    const [ChannelNameOpen, setChannelNameOpen] = React.useState(false);

    const handleChannelNameOpen = () => {
        setChannelNameOpen(true);
        handleMenuClose();
    };
  
    const handleChannelNameClose = () => {
        setChannelNameOpen(false);
    };

//________________________________________________________
    //Gestion sous-menu des permissions utilisateurs

    const [ChannelUsersOpen, setChannelUsersOpen] = React.useState(false);

    const handleChannelUsersOpen = () => {
        setChannelUsersOpen(true);
        handleMenuClose();
    };
  
    const handleChannelUsersClose = () => {
        setChannelUsersOpen(false);
    };

//__________________________________________________________
    // gestion du sous-menu supprimer le channel (uniquement le créateur)
    const [ChannelDeleteOpen, setChannelDeleteOpen] = React.useState(false);

    const handleChannelDeleteOpen = () => {
        setChannelDeleteOpen(true);
        handleMenuClose();
    };

    const handleChannelDeleteClose = () => {
        setChannelDeleteOpen(false);
    };

//_________________________________________________________________

    // Affichage menu
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
                <ChannelNameManager 
                    open={ChannelNameOpen} 
                    handleClose={handleChannelNameClose} 
                    channels= {channels}
                    setChannels= {setChannels}
                    currentChannel={currentChannel}
                />
            <MenuItem onClick={handleChannelUsersOpen}>Gerer les utilisateurs</MenuItem>
                <ChannelUsersManager 
                        open={ChannelUsersOpen} 
                        handleClose={handleChannelUsersClose} 
                        channels= {channels}
                        setChannels= {setChannels}
                        currentChannel={currentChannel}
                />
            <MenuItem onClick={handleChannelDeleteOpen}>Supprimer le channel/Quitter le channel</MenuItem>
                <ChannelDeleteAlert
                        open={ChannelDeleteOpen}
                        handleClose={handleChannelDeleteClose}
                        channels= {channels}
                        setChannels= {setChannels}
                        currentChannel={currentChannel}
                        setCurrentChannel={setCurrentChannel}
                />
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