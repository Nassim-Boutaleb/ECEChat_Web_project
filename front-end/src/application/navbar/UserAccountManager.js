import React,{useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import api from '../../api';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Boite de dialogue pour changer le nom du channel
const UserAccountManager = ({open,handleClose,userConnected,setUserConnected}) => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState(''); // Le mot de passe controlé par formulaire
    const [oldPassword,setOldPassword] = useState('');  // Le mot de passe do'origine sauvegardé
    const [email,setEmail] = useState('');
    const [avatarPreference,setAvatarPreference] = useState('');
    const [profileImageNoGravatar,setProfileImageNoGravatar] = useState('');
    const [id,setId] = useState();
    const [useEffectReload,setUseEffectReload] = useState (false);
    const [checked,setChecked] = useState(false);
    const [errorUsername,setErrorUsername] = useState(false);
    const [errorEmail,setErrorEmail] = useState(false);
    const [light,setLight] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //1) Construire l'objet user avec les données (nouvelles ou anciennes)
        const updatedUser = {
            username: username,
            email: email,
            password: password,
            profileImageNoGravatar : profileImageNoGravatar,
            avatarPreference: avatarPreference
        }

        //1b) Faut il encrypter le nouveau mdp ou a t'on gardé l'ancien ?
        const encrypt = checked;  // true= case nouveau mdp cochée = il faut encrypter

        //2) Mise a jour en BDD
        const data = await api.updateUser(updatedUser,id,encrypt);

        if (data === '1') { // mail existe deja
            setErrorEmail(true);
            setErrorUsername(false);
        }
        else if (data === '2') {  // username existe deja
            setErrorEmail(false);
            setErrorUsername(true);
        }
        else {  // si aucn pb
            //3) Mise a jour du state userConnected
            updatedUser.id = id;
            setUserConnected(updatedUser);

            //4) Fermer la boite de dialogue
            handleClose();

            // 5) Recharger le use Effect la prochaine fois
            setUseEffectReload(!useEffectReload);
        }
    }

    const handleChange = (e) => {
        const champModifie = e.target.name;
        const newValue = e.target.value;

        if (champModifie === 'username') {
            setUsername(newValue);
        }
        else if (champModifie === 'password') {
            setPassword(newValue);
        }
        else if (champModifie === 'email') {
            setEmail (newValue);
        }
        
    }

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);
        if (isChecked === true) {
            setPassword('');
        }
        else {
            setPassword(oldPassword);
        }
    }

    const handleLight = (e) => {
        setLight (e.target.checked);
        if (e.target.checked === true) {
            alert("Light mode activé");
        }
        else {
            alert("Dark mode");
        }
    }

    const handleClickClose = () => {
        setUseEffectReload(!useEffectReload);
        handleClose();
    }

    // charger les données actuelles de l'utilisateur
    useEffect ( ()=> {
        const loadDataUser = async () => {
            //1) Appel à l'API qui à partir du token récupère les données du user
            const userActual = await api.getUser();

            //2) remplir les champs
            setUsername(userActual.username);
            setPassword(userActual.password);
            setOldPassword(userActual.password);
            setEmail(userActual.email);
            setProfileImageNoGravatar(userActual.profileImageNoGravatar);
            setAvatarPreference(userActual.avatarPreference);
            setId (userActual.id);
            setChecked(false);
            setErrorEmail(false);
            setErrorUsername(false);
            setLight(false);
        }
        loadDataUser();
        
    },[useEffectReload]);

    return (
        <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Modification informations personnelles</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Saisir vos nouvelles informations personnelles
            </DialogContentText>
            <form onSubmit={handleSubmit} id='userForm'>
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={errorUsername}
                    helperText={errorUsername&&'Ce username existe deja !'}
                />
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    inputProps={{ 'aria-label': 'modifier mot de passe' }}
                /> Modifier mot de passe ?
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    name="password"
                    label="nouveau mot de passe"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={checked ? false : true}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    name="email"
                    label="adresse mail"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={errorEmail}
                    helperText={errorEmail&&'Cet email existe deja !'}
                />
                <FormControlLabel
                    control={<Switch checked={light} onChange={handleLight} name="light" />}
                    label="Light mode"
                />
                
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClickClose} color="primary">
                Annuler
            </Button>
            <Button type='submit' color="primary" form='userForm'>
                Valider
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default UserAccountManager;