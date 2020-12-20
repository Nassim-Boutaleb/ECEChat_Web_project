// Composant qui gère la connexion d'un utilisateur
import React, {useState} from 'react'
import api from './../api'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
//import privateKey from '../privateKey'
const privateKey = require ( './../privateKey');
const jwt = require('jsonwebtoken');


// Styles
const styles = {
    form: {
        //borderTop: '2px solid #373B44',
        padding: '.5rem',
        //display: 'flex',
        //justifyContent:'center',
        //alignItems:'center'
    },
    card: {
        backgroundColor: '#9096A3',
        display:'flex',
        flexDirection: 'column',
        width: '600px'
    },
    cardContent : {
        display:'flex',
        flexDirection: 'column'
    },
    root: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#373B44'
    },
    textFields : {
        margin: '20px'
    }
    
};

// Composant Login
const Login = () => {
    
    // Etats pour stocker les valeurs du formulaire
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState ('');

    // Erreur formulaire
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    
    // A l'envoi du formualire : appel à l'API pour récupérer la liste de tous les utilisateurs
    // et vérifier si login et mdp OK
    const handleSubmit = async (e) => {
        e.preventDefault();

        // appel à l'API de récupération des utilisateurs et de vérification du login
        // {data} permet de ne récupérer que les données du get (sinon axios renvoie d'autres données )
        // axios est asynchrone, il faut attendre
        const code = await api.apiLogin(username,password);


        if (code === '0')  // utilisateur trouvé
        {
            window.location ="/Main";
        }
        else if (code==='2') {
            setErrorPassword(true);
            setErrorUsername(false);
            //alert ("Mauvais mot de passe");
        }
        else {
            setErrorUsername(true);
            setErrorPassword(false);
            //alert ("pas trouvé");
        }
    } 

    const handleChange = (e) => {
        const champModifie = e.target.name ;
        const newValue = e.target.value;
        if (champModifie === 'username') setUsername(newValue);
        else if (champModifie === 'password') setPassword(newValue);
    }

    return (
        <div style={styles.root}>
        
            <Card style={styles.card}>
                <CardContent style={styles.cardContent}>
                    <TextField style={styles.textFields}
                        id="username"
                        name="username"
                        label="username"
                        type="text"
                        value={username} 
                        onChange={handleChange}
                        error={errorUsername}
                        helperText={errorUsername?'Cet utilisateur n\'existe pas': ''}
                        autoFocus
                    />
                    <TextField style={styles.textFields}
                        id="password"
                        name="password"
                        label="mot de passe"
                        type="password"
                        value={password} 
                        onChange={handleChange}
                        error={errorPassword}
                        helperText={errorPassword?'Mot de passe incorrect': ''}
                    />
                </CardContent>
                <CardActions style={styles.cardContent}>
                    <Button variant="outlined" onClick={handleSubmit} color="primary">Se connecter</Button>
                    <p style={{color:'white'}}>Pas de compte ? </p>
                    <Button variant="outlined" onClick={()=>{window.location='/signup'}} color="secondary">Créer un compte</Button>
                </CardActions>
            </Card>
        
        </div>
    )
};

export default Login;