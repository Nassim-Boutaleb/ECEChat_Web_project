import React from 'react';

// définition du style
const styles = {
    footer: {
        height: '30px',
        backgroundColor: 'rgba(255,255,255,.3)',
        flexShrink: 0,
    },
};


// Composant Footer sous forme de fonction
const Footer =  () => {
    return (
        <footer className="App-footer" style={styles.footer}>
            footer
        </footer>
    );
};

export default Footer;