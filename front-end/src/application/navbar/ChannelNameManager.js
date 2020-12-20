import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../api';

// Boite de dialogue pour changer le nom du channel
const ChannelNameManager = ({open,handleClose,channels,setChannels,currentChannel}) => {

    const [channelName,setChannelName] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Modifier channel
        //1) On récupère le channel dans une nouvelle variable à partir de son index et on le MAJ
        let newChannel = channels[currentChannel];
        newChannel.name = channelName;

        //2) Mise a jour en base de données
        await api.updateChannel (newChannel);

        //3) Mise a jour du tableau channels avec setChannels et appel auto de Render()
        let newChannelsList = channels.slice();
        newChannelsList[currentChannel] = newChannel;
        setChannels (newChannelsList);

        //4) Fermer la boite de dialogue
        handleClose();
    }

    const handleChange = (e) => {
        setChannelName(e.target.value);
    }

    return (
        <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Nom du channel</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Saisir le nouveau nom du channel
            </DialogContentText>
            <form onSubmit={handleSubmit} id='ChannelNameForm'>
            <TextField
                autoFocus
                margin="dense"
                id="ChannelName"
                label="Nouveau nom du channel"
                type="text"
                value={channelName}
                onChange={handleChange}
                required
                fullWidth
            />
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Annuler
            </Button>
            <Button type='submit' color="primary" form='ChannelNameForm'>
                Valider
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default ChannelNameManager;