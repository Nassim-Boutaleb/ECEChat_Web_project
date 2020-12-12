import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import api from './../api'

const ChannelNewDialog = () => {
  const [open, setOpen] = React.useState(false);  // Gestion boite dialogue
  const [channelName,setChannelName] = useState('');
  
  const handleChange = (e) => {
      const newValue = e.target.value;
      //console.log ("NewValue: "+newValue);
      setChannelName(newValue);
  }

  const handleSubmit = async () => {
      const channel = {name:channelName};
      console.log ("ChannelsAvCrea: "+JSON.stringify(channel));
      const data = await api.createChannel(channel);
      console.log ("ChannelApresCrea: "+data);
      setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <Fab color="primary" onClick={handleClickOpen} aria-label="add">
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        
        <DialogTitle id="form-dialog-title">Creer un nouveau channel</DialogTitle>
        
        <DialogContent>
          
          <DialogContentText>
            Entrez ci-dessous les informations de votre nouveau channel : 
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            id="channelName"
            label="Nom du channel"
            type="text"
            onChange = {handleChange}
            fullWidth
          />
        
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          
          <Button onClick={handleSubmit} color="primary">
            Créer le channel
          </Button>
        </DialogActions>
      
      </Dialog>
    
    </div>
  );
}

export default ChannelNewDialog;