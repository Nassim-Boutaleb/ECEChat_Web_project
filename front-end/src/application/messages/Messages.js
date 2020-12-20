import React from 'react';
import api from '../../api';
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
// de type  [{"author":"47","authorUsername":"T9","authorEmail":"test@mail.com","content":"C3 1","creation":1608381214566,"channelId":"3b","creationForId":"1608381214579429"}]
// et une prop channel = objet channel choisi (pour afficher son nom)
// et une prop user connected représentant l'actuel utilisateur connecté 
// de type {"username": "T9","email": "test@mail.com","password": "T99","profileImageNoGravatar": "/pics/Image/4","id": "47"}
// On utilise map pour extraire du tableau messages chaque message individuel (<Message/>)
const Messages =  ({messages,channel,userConnected,setMessages,isCreator}) => {
    
    // gestion suppression d'un message
    // a partir de son id (channelId et creationForId) pour la BDD
    // a partir de son index pour le state messages
    const handleDeleteMessage = async (index,message) => {
        //1. appel à l'API de suppression de message
        // On passe le channel car l'api va regarder qui (créateur ou user) tente de supprimer le message
        const data = await api.deleteMessage(message,channel,userConnected);

        // En fonction de la valeur de retour
        // Si c'est le créateur du channel qui a supprimé le message: suppression
        //totale du message de la liste des messages
        if (data === 'creatorDeletion') {
            const newMessagesList = messages.slice();
            newMessagesList.splice(index,1);
            setMessages(newMessagesList);
        }

        // si c'est un utilisateur : on va la mettre a jour
        else if (data === 'userDeletion') {
            const newMessagesList = messages.slice();
            newMessagesList[index].content = 'message supprimé par son auteur';
            setMessages(newMessagesList);
        }

        // sinon erreur 
        else {
            alert ("Erreur lors de la suppression du message "+data);
        }
    }

    // Cette fonction permet la modification du contenu d'un message
    // prend en paramètre l'index du message et le nouveau message
    const handleModifyMessage = async (index,message,channel) => {
        //1. appel à l'api pour modification en BDD
        await api.modifyMessageContent(message,channel);

        //2.Mise a jour du message dans le state
        const newMessagesList = messages.slice();
        newMessagesList[index] = message;
        setMessages(newMessagesList);
    }
    
    
    
    return (
        <div style={styles.messages} >
            <h1>Messages du channel: {channel.name}</h1>
            
            <ul style={styles.list}>
                { messages.map( (it,index) => (
                    <Message 
                        key={it.creation} 
                        message={it} 
                        me={it.author===userConnected.id} 
                        index={index}
                        handleDeleteMessage={handleDeleteMessage} 
                        isCreator={isCreator}
                        handleModifyMessage={handleModifyMessage}
                        channel={channel}
                        userConnected={userConnected}
                    />
                ))}
            </ul>
        
        </div>
    );
};

export default Messages;