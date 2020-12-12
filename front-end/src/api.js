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
    const decToken = jwt.verify(token,privateKey);
    const userId = decToken.sub;
    console.log ("Token dec: "+JSON.stringify(decToken)+" id: "+userId);

    const {data} = await axios.get (`${url}/users/${userId}`);
    //console.log ("RRRRR: "+JSON.stringify(data));

    return data;
}

/*const handleClickTest = async () => {
    const token = localStorage.getItem('token');
    const rep = await axios.get(`${url}/channels`,{
        headers : {
            'authorization' :   'Bearer ' + token
        }
    });
    console.log ("APIRES: "+rep);
}*/

// Creation d'un channel 
// Paramètre: objet channel {name:"channel1"}
// et userList : [{id:"cvvs",username:"MB"}]
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

export default {
    apiSignup,
    apiLogin,
    tokenExists,
    getUser,
    createChannel,
    getAllChannelsTest,
    getChannelsOfConnectedUser,
    userExists
    
};