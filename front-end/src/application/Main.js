import React, {useState} from 'react';
import Channels from './Channels'
import Channel from './Channel'
import api from './../api'



// définition du style
const styles = {
    main: {
        backgroundColor: '#373B44',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
    },
};



// Composant Main sous forme de fonction 
const Main =  () => {
    
    // Etat: tableau de channels
    const  [channels,setChannels] = useState ([
        {
            name: 'Fake channel'
        }
    ]);

    // Id et récupération des infos utilisateur:
    //let userId = localStorage.getItem('userId');
    //let userEmail = localStorage.getItem('userEmail');
    //let userName = localStorage.getItem('userName');
    //console.log ("MainId: "+userId+" "+userEmail+" "+userName);
    

    // Etat : channel choisi
    const  [currentChannel,setcurrentChannel] = useState ([0]);
    // attendre avant de render
    const [isLoading, setLoading] = useState(true);
    // stocker en état l'utilisateur connecté récupéré grâce à l'api
    const [userConnected,setUserConnected] = useState('');

    const getUserConnectedFc = async () => {
        // appel à l'API qui va, à partir du token, rechercher l'id de l'utilisateur connecté 
        // et renvoyer cet utilisateur
        const userConnected = await api.getUser();
        //console.log ("Main:YESSS");
        //console.log ("UCONN: "+JSON.stringify(userConnected));
        setUserConnected(userConnected);
        setLoading(false);
    }
    
    // tant que axios n'a pas répondu avec le user connected
    if (isLoading) {
        getUserConnectedFc();
        return <div className="App">Loading...</div>;
    }
    
    const handleClickTest = (e) => {
        api.handleClickTest();
    }

    return (
        <main className="App-main" style={styles.main}>
            <Channels 
                setChannels={setChannels}
                channels={channels}
            />
            <Channel 
                channel={channels[currentChannel]}
                userConnected = {userConnected}
            /> {/**On passe le channel choisi à channel */}

            <button value="TEST" onClick={handleClickTest}>TEST </button>
            
        </main>
    );
};

export default Main;