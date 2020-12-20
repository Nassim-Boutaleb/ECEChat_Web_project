import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from './../../api'

const ChannelLeaveAlert = ({open,handleClose,channels,setChannels,currentChannel,setCurrentChannel}) => {

    const handleLeave = async() => {
        //1. Récupérer le channel ID
        const channelToDelete = channels[currentChannel];
        const channelId = channelToDelete.id;
        
        //3. Suppression du user du channel et mise a jour 
        const delChannel = await api.deleteUserFromChanel(channelId,channels[currentChannel]);
        alert (delChannel);

        //4. Mettre a jour le tableau de channels en le supprimant de notre liste peros de channel+ reRender
        const copyChannels = channels.slice();
        copyChannels.splice(currentChannel,1);
        setChannels(copyChannels);
        setCurrentChannel(0);

        handleClose();
    }


    return (
        <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Suppression channel"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Etes vous certain de vouloir quitter le channel {channels[currentChannel].name} ?
                Il faudra qu'un administrateur ou que le créateur du channel vous rajoute au channel
                pour pouvoir y revenir ! 
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Annuler
            </Button>
            <Button onClick={handleLeave} color="primary" autoFocus>
                Oui, je veux quitter le channel
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default ChannelLeaveAlert;