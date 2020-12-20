import React,{useState} from 'react'
import Navbar from './navbar/Navbar'
import Main from './Main'
import api from './../api'

const styles = {
    root: {
      //border: '5px green solid',
      //width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      //overflow: 'hidden',
      //position: 'absolute',
      height: '100%',
      width: '100%',  // w et h à 100% pour éviter le défilement global du navigateur
    }
  } // fin styles


const MainPage = () => {

    // Drawer channels 
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };

  // Gestion channels, currentChannel et connected user + chargement page
  // State: tableau de channels du type [{name:'c1},{name:'c2},...]
  const  [channels,setChannels] = useState ([]);

  // State : channel choisi (index dans le tableau des channels) par défaut channel 0
  const  [currentChannel,setCurrentChannel] = useState (0);   // useState([0]) par Worms ?!
   
  // State: stocker l'utilisateur connecté récupéré grâce à l'api {'username':'xxx',...}
  const [userConnected,setUserConnected] = useState('');
  
  // attendre avant de render
  const [isLoading, setLoading] = useState(true);


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

  // Fonction permettant de mettre a jour un channel du tableau de channel // finalement non ? 

    return (
        <div style={styles.root}>
            <Navbar 
              handleDrawerOpen={handleDrawerOpen}
              userConnected={userConnected}
              setUserConnected={setUserConnected}
              channels={channels}
              setChannels={setChannels}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
            />

            <Main 
                open={open} 
                onClick={handleDrawerClose} 
                handleDrawerClose={handleDrawerClose} 
                channels={channels} setChannels={setChannels} 
                currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} 
                userConnected={userConnected} setUserConnected={setUserConnected}
            />
        </div>
    );
}

export default MainPage;