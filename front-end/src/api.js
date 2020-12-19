//import { use } from '../../back-end/lib/app';
//import privateKey from './privateKey'

const privateKey = require ( './../src/privateKey');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');

const url = 'http://localhost:3001' ; 

// Gestion des fonctions de l'API avec axios

// Ajout d'un utilisateur en bdd
// En paramètre : l'utilisateur a ajouter sous la forme {username:'user_1,email:'email',password:'pass1'}
// Retourne : ?
const apiSignup = (user) => {
    //console.log (JSON.stringify(user));

    // appel à la route post /users pour créer l'utilisateur en BDD
    user = axios.post (`${url}/users`, user)

    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

    //console.log (errors);
    //return errors;
    
};

// Renvoie la liste de ts les utilisateurs en BDD
// Pas de paramètre
// retourne : tableau de la forme [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b","password":"eee"},{...} ]

const apiLogin =  () => {
    // appel à la route get/users qui retourne un tableau contenant l'ensemble des users
    // de la forme [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"},{...} ]
    return (
        axios.get (`${url}/users`)
    );
};

// Vérifier si un token existe dans le stockage et s'il est valide
// Renvoie true si token existe et OK, false sinon 
const tokenExists = () => {
    const exist = localStorage.getItem('token') !== null;  // renvoie true si existe et false sinon
    if (exist) {
        // Vérifier la validité du token (durée de vie, hash, ...)
        const token =  localStorage.getItem('token');
        try {
            const decToken = jwt.verify(token,privateKey);
        } catch (e) {
            console.log ("Erreur validation du token");
            console.log ("Error: "+e);
            return false; // on sera redirigé vers /login
        }    
    }
    return exist ; // true si existe, false si n'existe pas
}

// Cherche le token dans le local storage
// A partir du token, récupère l'id de l'utilisateur connecté
// puis retourne cet utilisateur sous la forme objet {"username":"T9","email":"test@gmail.com","password":"T99","id":"ce4ea26c-5abc-4060-b98f-18c11d627eec"}
const getUser = async () => {
    const token =  localStorage.getItem('token');
    console.log ("Token :"+token);
    const decToken = jwt.verify(token,privateKey);
    const userId = decToken.sub;
    console.log ("Token dec: "+JSON.stringify(decToken)+" id: "+userId);

    const {data} = await axios.get (`${url}/users/${userId}`);
    //console.log ("RRRRR: "+JSON.stringify(data));

    return data;
}



// Creation d'un channel 
// Paramètre: objet channel {name:"channel1"}
// et userList : [{id:"cvvs",username:"MB",status:'utilisateur'}]
// retourne: le channel créé
const createChannel = async (channel,userList) => {
    const token = localStorage.getItem('token');
    console.log ("APIFRONTCREECHANNEL: "+JSON.stringify(channel));
    const {data} = await axios.post(`${url}/channels`,{channel:channel,userList:userList},{
        headers : {
            'authorization' :   'Bearer ' + token
        }
    });
    return data;
}

const getAllChannelsTest = async () => {
    const token = localStorage.getItem('token');
    return (axios.get(`${url}/allChannels`,{
        headers : {
            'authorization' :   'Bearer ' + token
        }
    }));
}

// Renvoie (à partir du token) la liste des channels de l'utilisateur connecté
// Retourne un tableau de channel contenant les channels auxquels le user connecté est abonné
const getChannelsOfConnectedUser = async () => {
    const token = localStorage.getItem('token');
    
    return (axios.get(`${url}/Channels`,{
        headers : {
            'authorization' :   'Bearer ' + token
        }
    }));
}

// Vérifie si un user correspondant au userName passé en paramètre existe ou pas
// Retourne le user s'il a été trouvé, retourne -1 sinon
const userExists = async (userName) => {
    const {data} = await axios.get (`${url}/users`);  // récupérer liste des users
    // Vérifier si le user existe
    let trouve = 0;
    let userId;
    for (let i=0; i<data.length; ++i) {
        if (data[i].username === userName) {
            userId = data[i].id;
            trouve ++;
        }
    }

    if (trouve > 0) {
        return userId;
    }
    else {
        return -1;
    }
}

// Fonction qui cherche les messages d'un channel en BDD
// Paramètre: l'id du channel
// Renvoie un tableau de messages
const getMessages = async(channelId) => {
    const token = localStorage.getItem('token');
    const {data} = await axios.get (`${url}/channels/${channelId}/messages`,
    {
        headers : {
            'authorization' :   'Bearer ' + token
        }
    });  

    return data;
}

// Ajouter un message en BDD
// Prend en paramètre le message à ajouter de type {content:'balbla',author:'David',creation:'11/11/11'}
// ainsi que l'id du channel
// Retourne le message créé
const addMessageDB = async (newMessage,channelId) => {
    
    const token = localStorage.getItem('token');
    console.log ('API addMessageDB newMessage:  '+JSON.stringify(newMessage));
    const {data} = await axios.post (`${url}/channels/${channelId}/messages`,newMessage,
    {
        headers : {
            'authorization' :   'Bearer ' + token
        }
    });  
    console.log ("API addMessageDB data retour: mess ajouté: "+JSON.stringify(data));
    return data;
}

// Mettre a jour un channel en BDD
// Param : le nouveu channel sous la forme 
//{"name": "Channel3","idUsers": [{"id": "55","status": "utilisateur"}],"creatorId": "47","id": "b9"}
// Retour: le nouveau channel sous la même forme
const updateChannel = async(newChannel) => {
    // récupérer ID du channel pour l'appel axios
    const newChannelId = newChannel.id;

    // token
    const token = localStorage.getItem('token');

    // axios
    const {data} = await axios.put (`${url}/channels/${newChannelId}`,newChannel,
    {
        headers : {
            'authorization' :   'Bearer ' + token
        }
    });  
    console.log ("API updateChannel data retour:  "+JSON.stringify(data));
    return data;

}

// Associer à un id user son username
// Recoit en paramètre un tableau d'ID users ['nkm','vge','bhl']
// Retourne un tableau d'objet associant [{id:'nkm',userName:'Nath',email:'zzz'},{}]
const getUsernameFromId = async (userListId) => {
    console.log ("api UNID: "+JSON.stringify(userListId));
    // 1) Récupérer la liste des utilisateurs de l'app
    // retourne un tableau de users
    const {data} = await axios.get (`${url}/users`);

    // 2) définir le tableau d'objets à rendre
    const userIdUsername = [];

    // 3) Parcourir les listes et associer id avec username et email
    for (let i=0; i<userListId.length; ++i) {
        for (let j=0; j<data.length;++j) {
            if (userListId[i] === data[j].id) {
                userIdUsername.push ({id:userListId[i],userName: data[j].username,email: data[j].email });
            }
        }
    }
    return userIdUsername;
}

// Cette fonction supprime en BDD tous les messages d'un channel donné
// En paramètre : l'id du channel en question)
// Retourne : message d'erreur ou de succès
const deleteChannelMessages = async (channelId) => {

    // Récupérer token
    const token = localStorage.getItem('token');

    //2. appel axios
    const {data} = await axios.delete (`${url}/channels/${channelId}/messages`,
    {
        headers : {
            'authorization' :   'Bearer ' + token
        }
    }); 
    
    return data;
}

// Cette f° supprime un channel en BDD à partir de son ID
// En paramètre : l'id du channel en question)
// Retourne : message d'erreur ou de succès
const deleteChannel = async (channelId) => {
     // Récupérer token
     const token = localStorage.getItem('token');

     //2. appel axios
     const {data} = await axios.delete (`${url}/channels/${channelId}`,
     {
         headers : {
             'authorization' :   'Bearer ' + token
         }
     }); 
     
     return data;
}

// Cette fonction déconnecte l'utilisteur en supprimant le token stocké dans localStorage
const logout = () => {
    localStorage.clear();
    window.location ="/";
} 

export default {
    apiSignup,
    apiLogin,
    tokenExists,
    getUser,
    createChannel,
    getAllChannelsTest,
    getChannelsOfConnectedUser,
    userExists,
    getMessages,
    addMessageDB,
    updateChannel,
    getUsernameFromId,
    deleteChannelMessages,
    deleteChannel,
    logout
    
};