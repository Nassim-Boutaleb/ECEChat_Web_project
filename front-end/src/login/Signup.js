// Composant qui gère l'inscription d'un nouvel utilisateur
import React, {useState} from 'react'
import api from './../api'

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

// Composant Signup
const Signup = () => {
    
    // Etats pour stocker les valeurs du formulaire
    const [email,setEmail] = useState ('');
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState ('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construire l'objet user de forme {username:'user_1,email:'email',password:'pass1'}
        const user = {
            username:username,
            email:email,
            password:password
        };

        /// On veut vérifier si le username ou l'email n'existent pas déjà
        // appel à l'API renvoyant l'ensemble des utilisateurs
        const {data} = await api.apiLogin();
        let usernameExiste = 0; 

        for (let i=0; i<data.length; ++i) {
            if (data[i].username === username) {
                usernameExiste ++;
            }
        }

        if (usernameExiste == 0) {
            // appel à l'API de création d'utilisateur
            api.apiSignup(user);
        } 
        else {
            alert ("username existe deja");
        }
        
    } 

    const handleChange = (e) => {
        const champModifie = e.target.name ;
        const newValue = e.target.value;
        if (champModifie === 'email') setEmail(newValue);
        else if (champModifie === 'username') setUsername(newValue);
        else if (champModifie === 'password') setPassword(newValue);
    }

    return (
        <form style={styles.form}  onSubmit={handleSubmit}>
            Email <input type="text" name="email" style={styles.content} value={email} onChange={handleChange} />
            Username <input type="text" name="username" style={styles.content} value={username} onChange={handleChange} />
            Password <input type="text" name="password" style={styles.content} value={password} onChange={handleChange} />
            <input type="submit" value="Inscription" style={styles.send} />
        </form>
    )
};

export default Signup;