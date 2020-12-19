import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatIcon from '@material-ui/icons/Chat';
import api from './../../api'
import IconButton from '@material-ui/core/IconButton';
const styles = {
icon : {
    order:'2',
    display:'flex',
    alignItems:'center'
},
}
const MessageManager = ({index,message,handleDeleteMessage}) => {
  
    // Gestion menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

//______________________________________________________________________
    // Gestion suppression d'un message (appel à la fonction de messages.js passée en prop)
    const clickDelete = (index,message) => {
        handleClose();
        handleDeleteMessage(index,message);
    }
//________________________________________________________________________

    return (
        <div  style={styles.icon}>
            <IconButton ><ChatIcon color='primary' onClick={handleClick}/></IconButton>
            <Menu
            id="message_manager"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Modifier message</MenuItem>
                <MenuItem onClick={()=>clickDelete(index,message)}>Supprimer message</MenuItem>
            </Menu>
        </div>
    );
}

export default MessageManager;