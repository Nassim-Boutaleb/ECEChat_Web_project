import React, {useState} from 'react';
import Channels from './channels/Channels'
import Channel from './messages/Channel'
import Drawer from '@material-ui/core/Drawer';


// définition du style
const styles = {
    main: {
        backgroundColor: '#373B44',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        //border: "2px red solid",
        padding: '30px',
        //height: '500px'
    },
};



// Composant Main sous forme de fonction 
// Props: open = détermine si le menu channels doit être open ou pas
// handleDrawerClose = f° pr fermer le drawer 
const Main =  ({open,handleDrawerClose,channels,setChannels,currentChannel,setCurrentChannel,userConnected,setUserConnected}) => {
    
   

    // Gestion du loading du composant channel
    const [channelIsLoading, setChannelLoading] = useState(true);

    

    
    

    // Channels: composant qui contient la liste des channels
        // on lui passe en propriété la liste des channels et la fonction permettant de modifier cette liste
    // Channel: la partie droite qui contient Messages et messagesForm
        // on lui passe en propriété le channel choisi par l'utilisateur et l'utilisateur connecté
        // ce composant n'est affiché que s'il y a au moins un channel qui existe
        // sinon erreurs car on lui passe un channel inexistant !
    return (
        <main className="App-main" style={styles.main}>
            <Drawer
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
            >
                <Channels
                    setCurrentChannel={setCurrentChannel}
                    channels={channels}
                    setChannels={setChannels}
                    setChannelLoading = {setChannelLoading}
                />
            </Drawer>
            {
                channels.length >0 ?
                <Channel 
                    channel={channels[currentChannel]}
                    userConnected = {userConnected}
                    isLoading = {channelIsLoading}
                    setLoading = {setChannelLoading}
                /> /**On passe le channel choisi à channel */
                : <div> Aucun channel pour votre compte ! Créez un channel avec +</div>
            }     
        </main>
    );
};

export default Main;