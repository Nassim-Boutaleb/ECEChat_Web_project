import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatIcon from '@material-ui/icons/Chat';
import api from './../../api'
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const styles = {
    icon : {
        order:'2',
        display:'flex',
        alignItems:'center'
    },
}
const MessageManager = ({index,message,handleDeleteMessage,handleModifyMessage,me,channel}) => {
  
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
    const clickDelete = () => {
        handleClose();
        handleDeleteMessage(index,message,channel);
    }
//________________________________________________________________________
    // Gestion sous menu nouveau contenu
    const clickModify = (index,message) => {
        handleClose();
        handleModDialogOpen();
    }

    // affichage du menu
    const [open, setOpen] = useState(false);
    const [newValue,setNewValue] = useState (message.content); // contenu du message 

    const handleModDialogOpen = () => {
        setOpen(true);
    };

    const handleModDialogClose = () => {
        setNewValue(message.content); // réinitialisation ! 
        setOpen(false);
    };

    const handleModifyContent = () => {
        handleModDialogClose();
        message.content = newValue;
        handleModifyMessage(index,message,channel);
    }

    const renderMenuModify = () =>  (
        <div>
            <Dialog open={open} onClose={handleModDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Modifier contenu du message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Les autres utilisateurs verront que le message a été modifié !
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newContent"
                        label="Contenu du message"
                        type="text"
                        fullWidth
                        value={newValue}
                        onChange = {(e)=> setNewValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModDialogClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleModifyContent} color="primary">
                        Modifier
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

//_________________________________________________________________________________

    return (
        <div  style={styles.icon}>
            <IconButton onClick={handleClick} ><ChatIcon color='primary'/></IconButton>
            <Menu
            id="message_manager"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
                {me && <MenuItem onClick={clickModify}>Modifier message</MenuItem> }
                    {renderMenuModify()}
                <MenuItem onClick={clickDelete}>Supprimer message</MenuItem>
            </Menu>
        </div>
    );
}

export default MessageManager;