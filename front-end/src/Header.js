import React from 'react';

// définition du style
const styles = {
    header: {
        height: '60px',
        backgroundColor: 'rgba(255,255,255,.3)',
        flexShrink: 0,
      }
};


// Composant Header sous forme de fonction
const Header =  () => {
    return (
        <header className="App-header" style={styles.header}>
            <h1>header</h1>
        </header>
    );
};

export default Header;