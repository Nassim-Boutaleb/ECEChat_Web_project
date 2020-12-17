import React,{useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import api from '../../api';


const styles = {
    userInput: {
        display: 'flex',
        
    },
    
};

// Boite de dialogue pour changer le nom du channel
const ChannelUsersManager = ({open,handleClose,channels,setChannels,currentChannel}) => {

    // Gestion du nouvel utilisateur a ajouter
    const [userName,setUserName] = useState('');
    const [userStatus,setUserStatus] = useState('utilisateur');
    const [errorUser,setErrorUser] = useState(false);
    
    const handleChange = (e) => {
        if (e.target.name === 'userName') {
            setUserName (e.target.value);
        }
        else if (e.target.name === 'userStatus') {
            setUserStatus (e.target.value);
        }
    }

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
    }
//_______________________________________________________________________
    // Gestion liste des users
    const [userList,setUserList] = useState([]);

    const delUser = (index) => {
        const newUserList = userList.slice(); // copier le tableau de la liste des users
        newUserList.splice(index,1);  // supprimer l'élément à supprimer
        setUserList(newUserList);  // sauvegarder la nouvelle liste+appel à render()
    }

    const handleChangeStatusInList = (e,index) => {
        const copyUserList = userList.slice(); // copie
        copyUserList[index].status = e.target.value;
        setUserList(copyUserList);
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // récupérer channel originel
        const actualChannel = channels[currentChannel];
        
        // Construire la nouvelle liste de user en ne gardant que id et status
        // On parcourt la userList en faisant attention de ne pas
        // push le creatorId dans cette liste
        let newIdUsers = [];
        for (let i=0; i< userList.length; ++i) {
            if (userList[i].id !== actualChannel.creatorId) {
                newIdUsers.push ({
                    id: userList[i].id,
                    status: userList[i].status
                })
            }
        }
        // L'API update channel prend un channel sous la forme
        // {"name": "Channel3","idUsers": [{"id": "55","status": "utilisateur"}],"creatorId": "47","id": "b9"}
        const updatedChannel = {
            name: actualChannel.name,
            idUsers: newIdUsers,
            creatorId: actualChannel.creatorId,
            id: actualChannel.id
        }
        const data = await api.updateChannel(updatedChannel);

        setUserList([]);
        
        // il faut aussi mettre a jour la liste des channels
        let copyChannelList = channels.slice();
        copyChannelList[currentChannel] = updatedChannel;
        setChannels(copyChannelList);

        setUpdateUseEffect (!updateUseEffect); // changer l'etat à chaque validation
        handleClose();
        
    }
    
   
//______________________________________________________________________________________
    // Cet etat sert à recharger le useEffect à chaque annulation ou validation de la boite
    // de dialogue
    const [updateUseEffect,setUpdateUseEffect] = useState(false); 

    // Au 1er chargement du composant: récupérer la userList du channel et la copier
    // dans le state userList
    // recharger à chaque fois le currentChannel change (ou à chaque validation/annulation)
    useEffect (() => {
        const setTheUserList = async () => {
            // 1) récupérer le channel à partir de l'index du current channel
            // actualChannel est du type {"name": "Channel1","idUsers": [{"id": "55","status": "utilisateur"},{...}],"creatorId": "47","id": "cf"},
            const actualChannel = channels[currentChannel];
        
            // 2) Copier la idUsers dans userList et extraire uniquement les id
            const userListIdChannel = [];
            for (let i=0; i<actualChannel.idUsers.length; ++i) {
                userListIdChannel.push (actualChannel.idUsers[i].id);
            }

            //3) actuellement userListChannel est du type ['nkm','vge'] avec les id users
            // Il nous faut récupérer le userName pour chaque id
            const userListWithUserName = await api.getUsernameFromId (userListIdChannel);
            
            // 4) On met a jour la userList
            // Il faut récupérer le statut que l'on a perdu suite à l'appel à l'api
            // L'ordre des utilisateurs n'a pas changé, donc leurs index non plus !
            const userListWithUsernameAndStatus = [];
            for (let i=0; i<userListWithUserName.length; ++i) {
                userListWithUsernameAndStatus.push ({
                    id: userListWithUserName[i].id,
                    username: userListWithUserName[i].userName,
                    email: userListWithUserName[i].email,
                    status: actualChannel.idUsers[i].status,
                }) 
            }
            // 5) On y ajoute le créateur du channel avec statut créateur en dernière position de la liste 
            // Il faut avant ça récupérer son username
            const creatorId = [actualChannel.creatorId];
            const creatorIdWithUsername = await api.getUsernameFromId(creatorId);

            userListWithUsernameAndStatus.push ({
                id: actualChannel.creatorId,
                username: creatorIdWithUsername[0].userName,
                status: 'propriétaire'
            });

            // 6) Set la liste
            setUserList (userListWithUsernameAndStatus); 
        }

        setTheUserList();
    },[currentChannel,updateUseEffect]); // recharger à chaque changement de currentChannel
    

    const handleAnnulation = () => {
        setUpdateUseEffect (!updateUseEffect); // changer l'etat à chaque annulation
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            
            <DialogTitle id="form-dialog-title">Modifier les utilisateurs et permissions</DialogTitle>
            
            <DialogContent>
            
            <DialogContentText>
                Ajouter un utilisateur pour le {channels[currentChannel].name}
            </DialogContentText>
            
            <div style={styles.userInput}>
                <TextField
                    //margin="dense"
                    id="userName"
                    name="userName"
                    label="Utilisateur à ajouter"
                    type="text"
                    value={userName}
                    onChange = {handleChange}
                    //fullWidth
                    error={errorUser}
                    helperText={errorUser?'Cet utilisateur n\'existe pas': ''}
                    style={styles.input}
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

            <DialogContentText>
                Liste des utilisateurs du channel.
                Vous pouvez modifier les permissions
            </DialogContentText>

            <ul>
                {
                    userList.map ( (it,index) => (
                        <li key={it.id} >
                            <b>{it.username}</b>
                            <span>       </span>
                            { it.status !== 'propriétaire' ?
                                <span>
                                    <Select
                                        labelId="Statut utilisateur"
                                        id="userStatusInList"
                                        value={it.status}
                                        onChange={(e)=>handleChangeStatusInList(e,index)}
                                        name='userStatusInList'
                                        
                                    >
                                        <MenuItem value='utilisateur'>utilisateur</MenuItem>
                                        <MenuItem value='administrateur'>administrateur</MenuItem>
                                    </Select> 
                                    <IconButton aria-label="delete" onClick={()=> delUser(index)}><DeleteIcon /></IconButton> 
                                </span>
                                : <i>Propriétaire du channel </i>
                            }
                            </li>
                    ))
                } 
            </ul>

            </DialogContent>
            
            <DialogActions>
            <Button onClick={handleAnnulation} color="secondary">
                Annuler
            </Button>
            
            <Button onClick={handleSubmit} color="primary">
                Mettre a jour le channel
            </Button>


            </DialogActions>
        
            </Dialog>
        </div>
    );
}

export default ChannelUsersManager;