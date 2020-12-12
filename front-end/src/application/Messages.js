import React from 'react';
import Message from './Message'

// définition du style
const styles = {
    messages: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto',
        '& ul': {
          'margin': 0,
          'padding': 0,
          'textIndent': 0,
          'listStyleType': 0,
        },
    },
};


// Composant Messages sous forme de fonction avec 1 prop messages = tableau de messages
// et une prop channel = objet channel choisi (pour afficher son nom)
// On utilise map pour extraire du tableau messages chaque message individuel (<Message/>)
const Messages =  ({messages,channel}) => {
    return (
        <div style={styles.messages}>
            <h1>Messages for {channel.name}</h1>
            <ul>
                { messages.map( (it) => (
                    <Message key={it.creation} message={it} />  // key: message.id en BDD ?
                ))}
            </ul>
        </div>
    );
};

export default Messages;