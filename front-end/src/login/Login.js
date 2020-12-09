// Composant qui gère la connexion d'un utilisateur
import React, {useState} from 'react'
import api from './../api'
//import privateKey from '../privateKey'
const privateKey = require ( './../privateKey');
const jwt = require('jsonwebtoken');


// Styles
const styles = {
    form: {
        borderTop: '2px solid #373B44',
        padding: '.5rem',
        display: 'flex',
    },
    content: {
        flex: '1 1 auto',
        marginRight: '.5rem'
    },
    send: {
        backgroundColor: '#D6DDEC',
        padding: '.2rem .5rem',
        border: 'none',
        ':hover': {
          backgroundColor: '#2A4B99',
          cursor: 'pointer',
          color: '#fff',
        },
    },
};

// Composant Login
const Login = () => {
    
    // Etats pour stocker les valeurs du formulaire
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState ('');
    
    // A l'envoi du formualire : appel à l'API pour récupérer la liste de tous les utilisateurs
    // et vérifier si login et mdp OK
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        // appel à l'API de récupération des utilisateurs et de vérification du login
        // {data} permet de ne récupérer que les données du get (sinon axios renvoie d'autres données )
        // axios est asynchrone, il faut attendre
        const {data} = await api.apiLogin();

        // Afficher
        console.log ("OOO "+JSON.stringify(data)+" "+data.length);

        let usernameTrouve = 0;
        let passCorrespond = 0;
        let userId = null;
        let userEmail = null;
        let userName = null;

        // Vérifier login et password
        for (let i=0; i<data.length; ++i) {
            if (data[i].username === username) {
                usernameTrouve ++;
                userId = data[i].id;
                userEmail = data[i].email;
                userName = data[i].username;
                console.log ("Heidi: "+userId+" "+userEmail+" "+userName);
                if (data[i].password === password) {
                    passCorrespond ++;
                }
            }
        }

        if (usernameTrouve > 0 && passCorrespond > 0) 
        {
            alert ("Trouvé !");
            localStorage.setItem('userId',userId);
            localStorage.setItem('userEmail',userEmail);
            localStorage.setItem('userName',userName);
            const prKey = privateKey;
            console.log ("PK: "+prKey);
            // JWT
            var token = jwt.sign(
                { 
                    sub: userId,
                    userName: userName
                }, 
                privateKey,
                { expiresIn: '1h' }
            );
            localStorage.setItem('token',token);
            console.log ("Token:"+token);

            window.location ="/Main";
        }
        else if (username > 0 && passCorrespond == 0) {
            alert ("Mauvais mot de passe");
        }
        else {
            alert ("pas trouvé");
        }
    } 

    const handleChange = (e) => {
        const champModifie = e.target.name ;
        const newValue = e.target.value;
        if (champModifie === 'username') setUsername(newValue);
        else if (champModifie === 'password') setPassword(newValue);
    }

    return (
        <form style={styles.form}  onSubmit={handleSubmit}>
            Username <input type="text" name="username" style={styles.content} value={username} onChange={handleChange} />
            Password <input type="text" name="password" style={styles.content} value={password} onChange={handleChange} />
            <input type="submit" value="Inscription" style={styles.send} />
        </form>
    )
};

export default Login;