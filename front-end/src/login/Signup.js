// Composant qui gère l'inscription d'un nouvel utilisateur
import React, {useState} from 'react'
import api from './../api'
import 'antd/dist/antd.css';
import {Avatar} from 'antd';
import ProfilePic from './ProfilePic';
import Pic1 from './pics/Image1.png';
import Pic2 from './pics/Image2.jpeg';
import Pic3 from './pics/Image3.png';
import Pic4 from './pics/Image4.jpg';

// Styles
const styles = {
    form: {
        borderTop: '2px solid #373B44',
        padding: '.5rem',
        display: 'flex',
        color: 'black'
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
    // gravatar
    const [profileImage,setProfileImage] = useState('');
    const [profileImagePath,setProfileImagePath] = useState('');

    const handleImageChange = (profileImage,index) => {
        setProfileImage(profileImage);
        setProfileImagePath(`/pics/Image/${index+1}`);
    }
    // end gravatar
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construire l'objet user de forme {username:'user_1,email:'email',password:'pass1'}
        const user = {
            username:username,
            email:email,
            password:password,
            profileImageNoGravatar:profileImagePath
        };

        /// On veut vérifier si le username ou l'email n'existent pas déjà
        // appel à l'API renvoyant l'ensemble des utilisateurs
        const data = await api.apiSignup(user);
        if (data === '1') {
            alert ("Cet email existe deja");
        }
        else if (data === '2') {
            alert ("Ce username existe deja");
        }
        else {
            console.log ('Vous etes inscrit');
            window.location ="/";
        } 
        
    } 

    const handleChange = (e) => {
        const champModifie = e.target.name ;
        const newValue = e.target.value;
        if (champModifie === 'email') setEmail(newValue);
        else if (champModifie === 'username') setUsername(newValue);
        else if (champModifie === 'password') setPassword(newValue);
    }

    const testGetAllChannels = async () => {
        const {data} = await api.getAllChannelsTest();
        console.log ("ALLCHANNELS:///: "+JSON.stringify(data));
    }

    const testGetPath = () => {
        console.log ("PPRRT: "+profileImagePath);
        console.log ("end");
    }

    return (
        <div>
        <form style={styles.form}  onSubmit={handleSubmit}>
            <Avatar size={128} icon="user" src={profileImage}/>
            <ProfilePic handleImageChange={handleImageChange} pic1={Pic1} pic2={Pic2} pic3={Pic3} pic4={Pic4}  />
            Email <input type="text" name="email" style={styles.content} value={email} onChange={handleChange} />
            Username <input type="text" name="username" style={styles.content} value={username} onChange={handleChange} />
            Password <input type="text" name="password" style={styles.content} value={password} onChange={handleChange} />
            <input type="submit" value="Inscription" style={styles.send} />
        </form>
        <button onClick={testGetAllChannels} >Get all Channels (TEST)</button>
        <button onClick={testGetPath} >Get path (TEST)</button>
        </div>
    )
};

export default Signup;