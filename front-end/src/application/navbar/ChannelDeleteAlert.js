import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from './../../api'

const ChannelDeleteAlert = ({open,handleClose,channels,setChannels,currentChannel,setCurrentChannel}) => {

    const handleDelete = async() => {
        //1. Récupérer le channel ID
        
        const channelToDelete = channels[currentChannel];
        const channelId = channelToDelete.id;
        
        // 2. Avant de supprimer le channel il faut en supprimer tous les messages 
        const data = await api.deleteChannelMessages(channelId);
        //alert (data);

        //3. Suppression du channel en lui-même
        const delChannel = await api.deleteChannel(channelId);
        //alert (delChannel);

        //4. Mettre a jour le tableau de channels + reRender
        const copyChannels = channels.slice();
        copyChannels.splice(currentChannel,1);
        setCurrentChannel(0);
        setChannels(copyChannels);

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
                Etes vous certain de vouloir supprimer le channel et l'intégralité des messages
                qu'il contient ? Cette opération est <b>irréversible</b>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Annuler
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
                Oui, je veux supprimer le channel
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default ChannelDeleteAlert;