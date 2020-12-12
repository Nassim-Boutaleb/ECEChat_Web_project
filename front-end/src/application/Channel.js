import React, {useState} from 'react';
import Messages from './Messages'
import MessageForm from './MessageForm'

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
const Channel =  ({channel,userConnected}) => {
    

    // Etat messages qui contient un tableau de messages [{M1},{M2}]
    const [messages, setMessages] = useState([
    {
        author: 'sergei',
        creation: 1602831101929,
        content: `
        ## 1 - Architecture - Level easy
        
        It is now the right time to re-organize/refactor our code. Split this
        monolithic react Component into multiple section. In the end, we should end
        up with the following components: 'Header', 'Footer', 'Main', 'Channels',
        'Channel', 'Messages', 'MessageSend':
        
        - 'App.js' file uses 'Header.js', 'Main.js', 'Footer.js'
        - 'Main.js' file uses 'Channels.js', 'Channel.js'
        - 'Channels.js' prints the list of channels
        - 'Channel.js' prints the messages, uses 'Messages.js' and 'MessageSend.js'
        - 'Messages.js' prints the list of messages inside the current channel
        - 'MessageForm.js' send a new message
        
        \`\`\`
        +--------------------------------------------+
        |                  Header                    |
        +--------------------------------------------+
        |   Channels    |          Channel           |
        |               | +------------------------+ |
        |               | |        Messages        | |
        |               | +------------------------+ |
        |               | |      MessageSend       | |
        |               | +------------------------+ |
        +--------------------------------------------+
        |                  Footer                    |
        +--------------------------------------------+
        \`\`\`
        `,
    },
    {
        author: 'david',
        creation: 1602832138892,
        content: `
        ## 2 - Styles - Level easy
        
        Give it some styles, use CSS to make it looks good. Possible source of
        improvements include changing the colors, replacing the HTML "send" button
        with an icon, working on the header, providing day/night themes ... be creative
        `,
    },
    {
        author: 'sergei',
        creation: 1602840139202,
        content: `
        ## 3 - Use an external library - Level medium
        
        Format the date in a human readable format. While the date is generated on
        the server side to ensure its relevance and prevent from forgery, it must be
        displayed according to the user browser local. The
        [Moment.js](https://momentjs.com/) library has been the library of choice
        for many years to accomplish date formatting. Read what is displayed on the
        top right corner of their homepage, it is now depreciated. Read the reasons
        and act accordingly.
        `,
    },
    {
        author: 'david',
        creation: 1602844139200,
        content: `
        ## 4 - Support message contents in Markdown - Level hard
        
        Markdown is the most popular syntax to format text into HTML. It is used
        by the majority of the project Readme files, to write documentation and to
        generate websites.
        
        I recommand you to use the [unified](https://unifiedjs.com/) which is very
        powerful and comes with a lot of plugins. You can read the Markdown to HTML
        guide in the learn section and enrich it with your selection of relevant
        plugins.
        
        Consider adding syntax highlight support with a library like
        [Prism](https://prismjs.com/).
        `,
    }
    ]);// Fin state messages

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
                />
                <MessageForm 
                    addMessage={addMessage}
                    userConnected = {userConnected}
                />
        </div>
    );
};

export default Channel;