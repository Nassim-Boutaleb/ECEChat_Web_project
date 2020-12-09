import React from 'react';

// définition du style
const styles = {
    channels: {
        minWidth: '200px',
    },
};


// Composant Channels sous forme de fonction
const Channels =  ({setChannels,channels}) => {
    return (
        <div style={styles.channels}>
                Chennels list
        </div>
    );
};

export default Channels;