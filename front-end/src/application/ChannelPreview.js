import React,{useState} from 'react'
import Button from '@material-ui/core/Button';

const styles = {
    btn: {
        width: '200px',
        margin: '5px'
    },
};

// Composant channel preview.
// Reçoit en propriété: son index dans le tableau des channels (de Main) et la une référence
// sur la fonction setCurrentChannel qui permet de modifier le channel courant
const ChannelPreview = ({index,setCurrentChannel,name}) => {

    // Clic sur le bouton: on change le channel courant par ce channel, à partir de l'index
    const handleChange = () => {
        setCurrentChannel(index);
    }
    
    return (
        <Button variant="contained" onClick={handleChange} style={styles.btn}>
            {name}
        </Button>
    );
}

export default ChannelPreview;