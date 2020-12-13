import React, {useState} from 'react';
import Channels from './Channels'
import Channel from './Channel'
import api from './../api'
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
const Main =  ({open,handleDrawerClose}) => {
    
    // Etat: tableau de channels du type [{name:'c1},{name:'c2},...]
    const  [channels,setChannels] = useState ([]);

    // Id et récupération des infos utilisateur:
    //let userId = localStorage.getItem('userId');
    //let userEmail = localStorage.getItem('userEmail');
    //let userName = localStorage.getItem('userName');
    //console.log ("MainId: "+userId+" "+userEmail+" "+userName);
    

    // Etat : channel choisi (index dans le tableau des channels) par défaut channel 0
    const  [currentChannel,setCurrentChannel] = useState (0);   // useState([0]) par Worms ?!
    
    // attendre avant de render
    const [isLoading, setLoading] = useState(true);
    // stocker en état l'utilisateur connecté récupéré grâce à l'api {'username':'xxx',...}
    const [userConnected,setUserConnected] = useState('');

    // appel à l'API qui va, à partir du token, rechercher l'id de l'utilisateur connecté 
    // et renvoyer cet utilisateur
    const getUserConnectedFc = async () => {
        const userConnected = await api.getUser();
        //console.log ("Main:YESSS");
        //console.log ("UCONN: "+JSON.stringify(userConnected));
        setUserConnected(userConnected);
    }

    // appel à l'API qui va lister (à partir du token) l'ensemble des channels de l'utilisateur connecté
    const getChannelsOfConnectedUser = async () => {
        const {data} = await api.getChannelsOfConnectedUser();
        console.log ("Data??: "+JSON.stringify(data));
        setChannels ([...data]);
        setLoading(false);
    }
    
    // tant que axios n'a pas répondu avec le user connected et chargé les channels
    if (isLoading) {
        getUserConnectedFc();
        getChannelsOfConnectedUser();
        return <div className="App">Loading...</div>;
    }
    

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
                />
            </Drawer>
            {
                channels.length >0 ?
                <Channel 
                    channel={channels[currentChannel]}
                    userConnected = {userConnected}
                /> /**On passe le channel choisi à channel */
                : <div> Aucun channel pour votre compte ! Créez un channel avec +</div>
            }     
        </main>
    );
};

export default Main;