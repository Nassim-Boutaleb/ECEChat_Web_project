import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ChannelNameManager = ({open,handleClose}) => {

    const [channelName,setChannelName] = useState('');
    
    const handleSubmit = async () => {
        alert ("submit");

        // Modifier channel
        //const newChannel = channel.copy();  // a verifier
        // newChannel.name = channelName;
        
        // Modifier le channel en BDD
        // await api.updateChannel (channel);
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