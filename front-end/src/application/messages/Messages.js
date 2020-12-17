import React from 'react';
import Message from './Message'

// définition du style
const styles = {
    messages: {
        display: 'flex',
        flexDirection: 'column',
        //flex: '1 1 auto',
        '& ul': {
          'margin': 0,
          'padding': 0,
          'textIndent': 0,
          'listStyleType': 0,
        },
        height: '100%',
        overflow: 'auto',
    },
    list: {
        listStyleType: 'none',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
};


// Composant Messages sous forme de fonction avec 1 prop messages = tableau de messages
// de type  {"author": "T9","content": "Bonjour","channelId": "cf","creation": 1608166207757,}
// et une prop channel = objet channel choisi (pour afficher son nom)
// et une prop user connected représentant l'actuel utilisateur connecté 
// de type {"username": "T9","email": "test@mail.com","password": "T99","profileImageNoGravatar": "/pics/Image/4","id": "47"}
// On utilise map pour extraire du tableau messages chaque message individuel (<Message/>)
const Messages =  ({messages,channel,userConnected}) => {
    return (
        <div style={styles.messages} >
            <h1>Messages du channel: {channel.name}</h1>
            
            <ul style={styles.list}>
                { messages.map( (it) => (
                    <Message key={it.creation} message={it} me={it.author===userConnected.username} />  
                    /**Il faudra plutot comparer les ID !! */
                ))}
            </ul>
        
        </div>
    );
};

export default Messages;