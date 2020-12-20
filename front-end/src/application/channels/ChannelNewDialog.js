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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import api from '../../api'



const styles = {
  userInput: {
      display: 'flex',
  },
};




const ChannelNewDialog = ({setChannels,channels}) => {
  const [open, setOpen] = React.useState(false);  // Gestion boite dialogue
  const [channelName,setChannelName] = useState('');  // stocker le nom du channel saisi
  const [userList,setUserList] = useState([]);  // Liste des ID et username des utilisateurs du channel
  const [userName,setUserName] = useState('');  // nom du user à ajouter à la liste des user
  const [userStatus,setUserStatus] = useState('utilisateur');  // statut de l'utilisateur (admin ou utilisateur)

  // gestion erreurs
  const [errorUser,setErrorUser] = useState(false);
  
  const handleChange = (e) => {
      const champModifie = e.target.name
      const newValue = e.target.value;
      //console.log ("NewValue: "+newValue);
      if (champModifie === 'channelName') {
          setChannelName(newValue);
      }
      else if (champModifie === 'userName') {
          //setUserList([...userList,newValue]);
          setUserName (newValue);
      }
      else if (champModifie === 'userStatus') {
        setUserStatus(newValue);
      }
  }

  // A la validation: appel à l'API pour créer le channel en BDD 
  const handleSubmit = async () => {
      const channel = {name:channelName};
      console.log ("ChannelsAvCrea: "+JSON.stringify(channel));
      const data = await api.createChannel(channel,userList);
      console.log ("ChannelApresCrea: "+JSON.stringify(data));
      
      // Ajouter le channel à la liste des channels stockée dans Main
      
      setOpen(false); // fermer boite de dialogue
      setChannels([...channels,data]);
      console.log ("ChannelasStateApres: ///: "+channels);
  }

  // Ajouter le user à la liste des users à ajouter au channel, après avoir vérifié son existance
  const handleAddUser = async () => {
      const data = await api.userExists(userName); // data contient soit l'ID du user retouvé, soit -1
      if (data === -1) {
        //alert ("pas trouvé");
        setErrorUser(true);
      }
      else {
        //alert ("Trouvé id= "+data);
        setUserList([...userList,{id:data,username:userName,status:userStatus}]);
        setErrorUser(false);
      }
      //console.log ("CGD: "+typeof setChannels === 'function');
  }

  // supprimer l'utilisateur de la liste des utilisateurs à ajouter à partir de son index
  const delUser = (index) => {
      const newUserList = userList.slice(); // copier le tableau de la liste des users
      newUserList.splice(index,1);  // supprimer l'élément à supprimer
      setUserList(newUserList);  // sauvegarder la nouvelle liste+appel à render()
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // DEB
  const dispList = () => {
    console.log ("LISTEUSERCHANNEL: "+JSON.stringify(userList));
  }


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
            name="channelName"
            id="channelName"
            label="Nom du channel"
            type="text"
            value={channelName}
            onChange = {handleChange}
            fullWidth
            error={channelName === ''}
            helperText={channelName === ''?'Veuillez saisir un nom pour le channel': ''}
          />

          <div style={styles.userInput}>
              <TextField
                margin="dense"
                id="userName"
                name="userName"
                label="Utilisateur à ajouter"
                type="text"
                value={userName}
                onChange = {handleChange}
                fullWidth
                error={errorUser}
                helperText={errorUser?'Cet utilisateur n\'existe pas': ''}
              />

              <Select
              labelId="Statut utilisateur"
              id="userStatus"
              value={userStatus}
              onChange={handleChange}
              name='userStatus'
              >
                  <MenuItem value='utilisateur'>utilisateur</MenuItem>
                  <MenuItem value='administrateur'>administrateur</MenuItem>
              </Select>
          </div>
          <Button variant="contained" onClick={handleAddUser} color="secondary">
            Ajouter utilisateur au channel
          </Button>

          <p>Liste des utilisateurs ajoutés au channel: </p>
          <ul>
            {
              userList.map ( (it,index) => (
                  <li key={it.id} >
                    {it.username}         ({it.status})
                    <IconButton aria-label="delete" onClick={()=> delUser(index)}><DeleteIcon /></IconButton> 
                  </li>
              ))
            } 
          </ul>

        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          
          <Button onClick={handleSubmit} color="primary">
            Créer le channel
          </Button>

          <Button onClick={dispList} color="primary">
            DispList
          </Button>

        </DialogActions>
      
      </Dialog>
    
    </div>
  );
}

export default ChannelNewDialog;