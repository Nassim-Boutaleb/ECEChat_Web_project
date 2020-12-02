import React, {useState} from 'react';
import Channels from './Channels'
import Channel from './Channel'

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

    // Etat : channel choisi
    const  [currentChannel,setcurrentChannel] = useState ([0]);
    
    return (
        <main className="App-main" style={styles.main}>
            <Channels 
                setChannels={setChannels}
                channels={channels}
            />
            <Channel channel={channels[currentChannel]}/> {/**On passe le channel choisi à channel */}
        </main>
    );
};

export default Main;