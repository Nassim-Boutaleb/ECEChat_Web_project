const axios = require('axios').default;

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

export default {
    apiSignup,
    apiLogin
};