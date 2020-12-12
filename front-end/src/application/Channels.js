import React,{useState} from 'react';
import api from './../api'
import ChannelNewDialog from './ChannelNewDialog'
import ChannelPreview from './ChannelPreview'

// définition du style
const styles = {
    channels: {
        //border:'solid red 5px',
        display: 'flex',
        flexDirection: 'column',
        margin: '30px 10px 0px 10px'  // haut dte bas gche
    },
    wrapper : {
        overflow: 'auto',
        width: '900px',
    }
};


// Composant Channels sous forme de fonction
// Reçoit en prop la liste des channels du user connecté et une réf sur la fonction permettant de modifier 
// le channel courant
const Channels =  ({setCurrentChannel,channels,setChannels}) => {
    
    //console.log ("AffChannelsEnd??: "+JSON.stringify(channels));
    return (
        <div style={styles.wrapper}>
            <ChannelNewDialog setChannels={setChannels} channels={channels}/>
            <div style={styles.channels}>
                {
                    channels.map ( (it,index) => (
                        <ChannelPreview
                            key={it.id}
                            index={index}
                            setCurrentChannel={setCurrentChannel}
                            name={it.name}    
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Channels;