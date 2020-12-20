import React,{useState} from'react';
import api from '../../api';
import ChatGravatar from '../Gravatar';

// Styles
const styles = {
    form: {
        borderTop: '2px solid #373B44',
        padding: '.5rem',
        display: 'flex',
    },
    content: {
        flex: '1 1 auto',
        marginRight: '.5rem',
        color: 'black'
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

// Composant MessageSend
const MessageForm = ({addMessage,userConnected,currentChannel}) => {

    // attendre avant de render
    //const [isLoading, setLoading] = useState(true);
    //const [userName,setUnsername] = useState('');

    /*const getUserConnectedFc = async () => {
        // appel à l'API qui va, à partir du token, rechercher l'id de l'utilisateur connecté 
        // et renvoyer cet utilisateur
        const userConnected = await api.getUser();
        console.log ("Main:YESSS");
        setUnsername(userConnected.username);
        setLoading(false);
    }*/
    
    /*if (isLoading) {
        getUserConnectedFc();
        return <div className="App">Loading...</div>;
    }*/

    let userEmail = userConnected.email ;
    let userName = userConnected.username; 
    console.log ("MessageForm: "+userName);

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const newMessage = {
            content: data.get('content'),
            author: userConnected.id,
            creation: Date.now(),
        };
        e.target.elements.content.value = ''; // réinitialiser contenu formulaire

        // Ajout du message en BDD
        const mbdd = await api.addMessageDB(newMessage,currentChannel.id);

        // Ajout du message dans la liste des messages. Appel à la fonction addMessage
        console.log (" mbdd: "+JSON.stringify(mbdd));

        // Pour affichage du username
        mbdd.authorUsername = userConnected.username;
        mbdd.authorEmail = userConnected.email;
        addMessage(mbdd,currentChannel.id); 
    } 
    return (
        <form style={styles.form}  onSubmit={onSubmit}>
            {
                userConnected.avatarPreference === 'gravatarRd' &&
                <img src={ChatGravatar(userConnected.email)}  width='60px' height='60px'/> 
            }
            {
                userConnected.avatarPreference === 'defaultRd' &&
                <img src={require(`./../../login${userConnected.profileImageNoGravatar}.jpg`) } width='60px' height='60px'/>
            }
            {
                userConnected.avatarPreference === 'uploadOwnRd' &&
                <img src={require(`./../../Images/${userConnected.profileImageNoGravatar}`) } width='60px' height='60px'/>
            } 
            <input type="text" name="content" style={styles.content} />
            <input type="submit" value="Send" style={styles.send} />
        </form>
    )
};

export default MessageForm;