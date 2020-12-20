// Composant qui gère l'inscription d'un nouvel utilisateur
import React, {useState} from 'react'
import api from './../api'
import 'antd/dist/antd.css';
import {Avatar} from 'antd';
import ProfilePic from './ProfilePic';
import Pic1 from './pics/Image/1.jpg';
import Pic2 from './pics/Image/2.jpg';
import Pic3 from './pics/Image/3.jpg';
import Pic4 from './pics/Image/4.jpg';
import AppImageUpload from './AppImageUpload'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    root :{
        color: 'black'
    }
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

    // Choix utilisateur
    const [radioValue,setRadioValue] = useState('gravatarRd');

    // Chemin de l'image personnalisée
    const [pathOwn,setpathOwn] = useState('');

    const handleImageChange = (profileImage,index) => {
        setProfileImage(profileImage);
        setProfileImagePath(`/pics/Image/${index+1}`);
    }
    // end gravatar
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let signupOk = false;
        // Vérifier que si on choisit de ne pas utiliser Gravatar une alternative a bien été selectionnée
        if (radioValue === 'defaultRd') {
            if (profileImagePath === ''){ 
                alert("Veuillez choisir une image !");
            }
            else {
                signupOk = true;
            }
        }
        else if (radioValue === 'uploadOwnRd') {
            if (pathOwn === ''){ 
                alert("Veuillez choisir une image !");
            }
            else {
                signupOk = true;
            }
        }
        if (signupOk === true || radioValue === 'gravatarRd') {
            // Construire l'objet user de forme {username:'user_1,email:'email',password:'pass1'}
            const user = {
                username:username,
                email:email,
                password:password,
                avatarPreference: radioValue,
                profileImageNoGravatar: radioValue==='defaultRd' ? profileImagePath : pathOwn 
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
            
    } 

    const handleChange = (e) => {
        const champModifie = e.target.name ;
        const newValue = e.target.value;
        if (champModifie === 'email') setEmail(newValue);
        else if (champModifie === 'username') setUsername(newValue);
        else if (champModifie === 'password') setPassword(newValue);
    }

    const handleRadio = (e) => {
        setRadioValue(e.target.value);
    }

    const testGetPath = () => {
        console.log ("PPRRT: "+profileImagePath);
        console.log ("end");
    }

    return (
        <div style={styles.root}>
        <RadioGroup aria-label="userChoice" name="userChoice" value={radioValue} onChange={handleRadio}>
                    <FormControlLabel value="gravatarRd" control={<Radio />} label="Utiliser mon gravatar (si pas de gravatar un par défaut sera fourni)" />
                    <FormControlLabel value="defaultRd" control={<Radio />} label=" Utiliser une image fournie par défaut (cliquer sur Pic Avatar )" />
                        <ProfilePic handleImageChange={handleImageChange} pic1={Pic1} pic2={Pic2} pic3={Pic3} pic4={Pic4} disabled={radioValue==='defaultRd'?false:true} />
                    <FormControlLabel value="uploadOwnRd" control={<Radio />} label=" Uploader mon propre avatar" />
                        <AppImageUpload disabled={radioValue==='uploadOwnRd'?false:true} setpathOwn={setpathOwn} />
        </RadioGroup>
             
               
        <form style={styles.form}  onSubmit={handleSubmit}>
            <Avatar size={128} icon="user" src={profileImage}/>
            Email <input type="text" name="email" style={styles.content} value={email} onChange={handleChange} required />
            Username <input type="text" name="username" style={styles.content} value={username} onChange={handleChange} required />
            Password <input type="text" name="password" style={styles.content} value={password} onChange={handleChange} required />
            <input type="submit" value="Inscription" style={styles.send} />
        </form>
        <button onClick={testGetPath} >Get path (TEST)</button>
        </div>
    )
};

export default Signup;