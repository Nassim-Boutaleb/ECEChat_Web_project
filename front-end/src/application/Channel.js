import React, {useState,useEffect} from 'react';
import Messages from './Messages'
import MessageForm from './MessageForm'
import api from '../api';

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
const Channel =  ({channel,userConnected,isLoading,setLoading}) => {
    

    // Etat messages qui contient un tableau de messages [{M1},{M2}]
    // Un message est du type {author:"sergei",creation:"556",content:blablabla}
    const [messages, setMessages] = useState([]);

    // UseEffect (React hook)
    // On récupère en BDD la liste des messages du channel
    // UseEffect est appellée juste après le 1er render et va aller chercher en BDD la liste
    // des messages du channel puis appeller setMessages, ce qui déclenche donc un nouvel
    // appel automatique de render()
    /*useEffect( () => {
        const getMessagesFcn = async () => {
            const m= await api.getMessages(channel.id);  // tableau de messages [{M1},{M2}]
            return m;
        }
        const messagesGet = getMessagesFcn(); //await api.getMessages(channel.id); //getMessagesFcn();
        console.log ("Front: messagesGet Channel: "+JSON.stringify(messagesGet));
        setMessages (messagesGet);
    });*/ // [] <=> useEffect sera appellée 1 seule fois, au chargement du composant uniquement et pas après chaque mise a jour
    
    const getMessages = async () => {
        const messagesGet = await api.getMessages(channel.id); //getMessagesFcn();
        console.log ("Front: messagesGet Channel: "+messagesGet);
        setMessages (messagesGet);
        setLoading(false);
    }
    if (isLoading) {
        console.log ("isLoading: "+channel.id);
        getMessages();
        return <div className="App">Loading...</div>;
    }

    // Fonction d'ajout de message. paramètre le nouveau message
    const addMessage = (message) => {  // paramètre: un objet message de tye {author:B,creation:C,content:X}
        setMessages([...messages,message])  //On met a jour l'état avec setMessages
        // on souhaite conserver les anciens messages stockés dans le tableau état "messages" donc on le passe en paramètre
        // de setMessages, en le destructurant message par message (sinon on aurait un tableau dans un tableau). On passe aussi notre nouveau "message"
        // on obtient l'état messages [{M1},{M2},{NouveauM}]. Si on avait pas destructuré avec ... on aurait eu
        // messages [[{M1},{M2}],{NM}]
    };

    // TEST
    const getAllMessagesTest = async () => {
        const messagesGet = await api.getMessages(channel.id); //getMessagesFcn();
        console.log ("les messages de "+channel.name+"= "+JSON.stringify(messagesGet));
    }

    
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
                />
                <MessageForm 
                    addMessage={addMessage}
                    userConnected = {userConnected}
                    currentChannel = {channel}
                />
                <button onClick={getAllMessagesTest}>TEST MESSAGES</button>
        </div>
    );
};

export default Channel;