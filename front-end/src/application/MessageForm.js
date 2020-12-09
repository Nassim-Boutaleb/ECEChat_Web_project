import React,{useState} from'react'
import api from './../api'

// Styles
const styles = {
    form: {
        borderTop: '2px solid #373B44',
        padding: '.5rem',
        display: 'flex',
    },
    content: {
        flex: '1 1 auto',
        marginRight: '.5rem'
    },
    send: {
        backgroundColor: '#D6DDEC',
        padding: '.2rem .5rem',
        border: 'none',
        ':hover': {
          backgroundColor: '#2A4B99',
          cursor: 'pointer',
          color: '#fff',
        },
    },
};

// Composant MessageSend
const MessageForm = ({addMessage,userConnected}) => {

    // attendre avant de render
    //const [isLoading, setLoading] = useState(true);
    //const [userName,setUnsername] = useState('');

    /*const getUserConnectedFc = async () => {
        // appel à l'API qui va, à partir du token, rechercher l'id de l'utilisateur connecté 
        // et renvoyer cet utilisateur
        const userConnected = await api.getUser();
        console.log ("Main:YESSS");
        setUnsername(userConnected.username);
        setLoading(false);
    }*/
    
    /*if (isLoading) {
        getUserConnectedFc();
        return <div className="App">Loading...</div>;
    }*/

    let userEmail = userConnected.email ;//localStorage.getItem('userEmail');
    let userName = userConnected.username; //localStorage.getItem('userName');
    console.log ("MessageForm: "+userName);

    const onSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        addMessage({
            content: data.get('content'),
            author: userName,
            creation: Date.now(),
        })
        e.target.elements.content.value = ''
    } 
    return (
        <form style={styles.form}  onSubmit={onSubmit}>
            <input type="input" name="content" style={styles.content} />
            <input type="submit" value="Send" style={styles.send} />
        </form>
    )
};

export default MessageForm;