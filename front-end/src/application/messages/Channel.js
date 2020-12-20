import React, {useState,useEffect} from 'react';
import Messages from './Messages'
import MessageForm from './MessageForm'
import api from '../../api';

// définition du style
const styles = {
    headerLogIn: {
        backgroundColor: 'red',
    },
    headerLogOut: {
        backgroundColor: 'blue',
    },
    channel: {
        height: '100%',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
};


// Composant Channel sous forme de fonction avec 1 prop channel qui contient 1 objet channel
// (le channel choisi). A partir de ce channel il ira chercher la liste des messages
const Channel =  ({channel,userConnected,currentChannel}) => {
    

    // Etat messages qui contient un tableau de messages [{M1},{M2}]
    // Un message est du type {author:"sergei",creation:"556",content:blablabla}
    const [messages, setMessages] = useState([]);

    // L'utilisateur connecté est-il créateur du channel ?
    const [isCreator,setCreator] = useState('false');

    
    const getMessages = async () => {
        // 1. on récupère en BDD un tableau de la forme 
        //{"author": "47","content": "Oups !","creation": 1608379742248,"channelId": "cf","creationForId": "1608379742287325"}
        const messagesGet = await api.getMessages(channel.id);
        //console.log ("les messages de "+channel.name+"= "+JSON.stringify(messagesGet));

        //2. On souhaite y ajouter un champ authorUsername contenant le username de celui qui a posté le message
        // et son email (pour gravatar)
        // une fonction getUsernameFromId de api.js permet d'associer à partir d'un tableau d'id le username et email
        if (messagesGet.length > 0) {  // s'il y a des messages !
            // Construction du tableau d'ID:
            const idAuthor = [];
            for (let i=0; i<messagesGet.length; ++i) {
                idAuthor.push (messagesGet[i].author);
            }

            // appel à l'api
            const usernameAuthor = await api.getUsernameFromId(idAuthor);
          
            // Réassocier toutes les données du message avec les nouvelles données
            const messagesWithAuthorUsername =[];
            for (let i=0; i<usernameAuthor.length; ++i) {
                messagesWithAuthorUsername.push ({
                    author: messagesGet[i].author,
                    authorUsername: usernameAuthor[i].userName,
                    authorEmail: usernameAuthor[i].email,
                    content: messagesGet[i].content,
                    creation: messagesGet[i].creation,
                    channelId: messagesGet[i].channelId,
                    creationForId: messagesGet[i].creationForId,
                    alive: messagesGet[i].alive,
                    lastModified: messagesGet[i].lastModified,
                    avatarPreference:usernameAuthor[i].avatarPreference,
                    profileImageNoGravatar: usernameAuthor[i].profileImageNoGravatar
                })
            }
            //console.log ("les messages de "+channel.name+"= "+JSON.stringify(messagesWithAuthorUsername));
            setMessages (messagesWithAuthorUsername);
        }
        else {
            setMessages ([]);
        }
        
        //3. Regarder si on est le créateur du channel ou pas ?
        if (userConnected.id === channel.creatorId) {
            setCreator('true');
        }
        
    }

    useEffect(()=> {
        getMessages();
    },[currentChannel]);

    

    // Fonction d'ajout de message. paramètre le nouveau message
    const addMessage = (message) => {  // paramètre: un objet message de tye {author:B,creation:C,content:X}
        setMessages([...messages,message])  //On met a jour l'état avec setMessages
        // on souhaite conserver les anciens messages stockés dans le tableau état "messages" donc on le passe en paramètre
        // de setMessages, en le destructurant message par message (sinon on aurait un tableau dans un tableau). On passe aussi notre nouveau "message"
        // on obtient l'état messages [{M1},{M2},{NouveauM}]. Si on avait pas destructuré avec ... on aurait eu
        // messages [[{M1},{M2}],{NM}]
    };

    

    
    // Messages = la liste des messages déjà écrits dans le channel
        // En propriété messages = tableau de messages et channel = le channel en cours
    // MessageForm= champ de saisie du message
        // En props addMessage la fonction pour ajouter le nouveau message à la liste des messages
        // userConnected le user connecté
    return (
        <div style={styles.channel}>
                <Messages
                    messages={messages}
                    channel = {channel}
                    userConnected = {userConnected}
                    setMessages={setMessages}
                    isCreator={isCreator}
                />
                <MessageForm 
                    addMessage={addMessage}
                    userConnected = {userConnected}
                    currentChannel = {channel}
                />
        </div>
    );
};

export default Channel;