import React,{useState,useEffect} from 'react'
import IconButton from '@material-ui/core/IconButton';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ChannelNameManager from './ChannelNameManager'
import ChannelUsersManager from './ChannelUsersManager'
import ChannelDeleteAlert from './ChannelDeleteAlert'
import ChannelLeaveAlert from './ChannelLeaveAlert'

const styles = {
    wrapper: {
      border: '1px solid black',
      borderRadius: '30px'
    },
    
  };

const ManageChannel = ({channels,setChannels,currentChannel,setCurrentChannel,userConnected}) => {
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

//_______________________________________________________________
    // Gestion du sous menu quitter le channel
    const [ChannelLeaveOpen, setChannelLeaveOpen] = React.useState(false);

    const handleChannelLeaveOpen = () => {
        setChannelLeaveOpen(true);
        handleMenuClose();
    };

    const handleChannelLeaveClose = () => {
        setChannelLeaveOpen(false);
    };

//_________________________________________________________________
    // Gestion des permissions
    // 0= user 1= admin 2= createur
    const [authorization,setAuthorization] = useState(0);
    useEffect (() => {
        let trouve=0;
        if (userConnected.id === channels[currentChannel].creatorId) {
            setAuthorization(2);  // je suis le créateur de ce channel
        }
        else {
            for (let i=0; i<channels[currentChannel].idUsers.length; ++i) {
                if (userConnected.id === channels[currentChannel].idUsers[i].id) {
                    if (channels[currentChannel].idUsers[i].status === 'administrateur') {
                        trouve ++;
                    }
                }
            }
            if (trouve <= 0) {
                setAuthorization(0);
            }
            else if (trouve > 0) {
                setAuthorization(1);
            }
        }
    },[currentChannel,channels]);
    //console.log ("Authorization: "+authorization+" channel : "+channels[currentChannel].name);

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
            {authorization===2 && <MenuItem onClick={handleChannelNameOpen}>Modifier nom du channel</MenuItem> }
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
                        authorization={authorization}
                />
            {authorization == 2 && <MenuItem onClick={handleChannelDeleteOpen}>Supprimer le channel</MenuItem> }
                <ChannelDeleteAlert
                        open={ChannelDeleteOpen}
                        handleClose={handleChannelDeleteClose}
                        channels= {channels}
                        setChannels= {setChannels}
                        currentChannel={currentChannel}
                        setCurrentChannel={setCurrentChannel}
                />
            {authorization < 2 && <MenuItem onClick={handleChannelLeaveOpen}>Quitter le channel</MenuItem> }
                <ChannelLeaveAlert
                        open={ChannelLeaveOpen}
                        handleClose={handleChannelLeaveClose}
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