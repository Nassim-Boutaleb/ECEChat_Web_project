
const privateKey = require ( './../../front-end/src/privateKey');
const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

app.use(require('body-parser').json());
app.use(cors());

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
});

/** Upload d'image */
const uploads = require ('./ImageUploadBack');

app.get('/Image', (req,res) => {
  
});

app.post('/Image',uploads.single('image'),async(req,res) => {
  console.log("L'image est push")
  const image = req.file.path;
  res.status(200).json(image);
});

// Channels

// Middleware systématiquement appelé avant toute autre requête vers channels
// vérifie la validité du token d'identification passé via le header authorization
app.use ('/channels', async (req,res,next) => {
  
  // Verifier token dans header
  
  

  // Si il y a un header 
  if (req.headers.authorization != null) {
    const tokenHeader = req.headers.authorization.split(' ')[1];
    
    let decodedToken ;
    try {
      decodedToken = jwt.verify(tokenHeader,privateKey);
    } 
    catch(e) {
      console.log ("Erreur middleware: "+e);
      res.status(403).json(e);
    }
    finally {
      // Variables qui seront passées au middleware suivants
      res.locals.userId = decodedToken.sub;
      
      
      // passer au middleware/requête suivant
      next();
    }
  }
  // Si pas de header
  else {
    const error = "Middleware: Header manquant";
    console.log (error);
    res.status(401).json(error);
  }
});

// Récupère les channels de l'utilisateur connecté (à partir du token récupéré)
// Pas de paramètres
// Reçoit du middleware d'identification res.locals.userId => id du user connecté
// Retourne un tableau de channels contenant uniquement les channel auxquels l'utilisateur connecté est abonné
app.get('/channels', async (req, res) => {
  
  const userId = res.locals.userId; // id de l'utilisateur connecté dont on veut lister les channels
  
  const channels = await db.channels.list(); // récupérer tous les channels de l'appli
  const channelsOfUser = [];  // on mettra les channels de l'utilisateur connecté ici
  


  // Channels est un tableau de channel du type [{name:"channel1",idUsers:['x54r','ppo6'],creatorID:xgsg,id:pxo}]
  // On parcourt le tableau de channels puis le sous-tableau des users du channel
  // Si l'id de notre user est trouvé ds la liste des users du channel: on garde le channel 
  // de même si l'id de notre user est trouvé comme étant le créateur du channel

  for (var i=0; i< channels.length; ++i) {
      for (j=0; j<channels[i].idUsers.length; j++) {
          
          if (channels[i].idUsers[j].id === userId) {
              
              channelsOfUser.push (channels[i]);
          }
      }
      if (channels[i].creatorId === userId){
          channelsOfUser.push (channels[i]);
      } // si on a pas trouvé notre user dans la liste des users du channel, il est peut être le créateur ?
  }

  res.json(channelsOfUser);
});

// TEST
// Retourne tous les channels de l'app
/*app.get('/allChannels', async (req, res) => {
  console.log ("Get all channels");
  const channels = await db.channels.list()
  res.json(channels)
});*/


// Crée un channel en base de données 
// En paramètre: l'objet channel de type {name:"channel 1"} et la liste des utilisateurs
// Reçoit du middleware d'identification res.locals.userId => id du user qui a créé le channel
// retourne le channel créé
app.post('/channels', async (req, res) => {
  const userId = res.locals.userId; // id de l'utilisateur qui a créé le channel
  const channel = await db.channels.create(req.body,userId);
  res.status(201).json(channel);
});

// Renvoie un channel à partir de son id
// en paramètre : l'id du channel à retrouver
// Revoie: un channel sous la forme {name:"XYZ"}
app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id);

  // Vérifier que j'ai le droit d'accéder à ce channel <=> je suis son créateur ou un utilisateur/admin
  let droit = false;
  for (let i=0; i<channel.idUsers.length ; ++i) {
      if (channel.idUsers[i].id === res.locals.userId) {
        droit = true;
      }
  }
  if (channel.creatorId === res.locals.userId) {
      droit = true;
  }

  if (droit === true) {
      res.status(200).json(channel);
  }
  else {
      res.status(403).json("Non autorisé à accéder à ce channel");
  }

});

// Met a jour le channel désigné par son id
// En paramètres: l'id du channel à mettre à jour et le contenu du nouveau channel sous forme d'objet
// Renvoie le channel mis à jour
app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.params.id,req.body);
  res.json(channel);
});

//Supprime le channel désigné
// N'effectue pas la suppression des messages, elle doit être faite séparément avant
// En paramètre url: l'id du channel à supprimer
app.delete('/channels/:id', async (req, res) => {
  // Il faut d'abord vérifier si on a le droit de modifier un channel
  // seul le créateur du channel peut le faire
  // 1) On récupère les données du channel à partir de son id
  const channel = await db.channels.get(req.params.id);

  //2) Regarder si on est bien le créateur
  if (channel.creatorId === res.locals.userId) {
      const data = await db.channels.delete(req.params.id);
      res.status(201).json(data);
  }
  else {
      res.status(403).json("Unauthorized to delete channel !");
  }
});

//______________________________________________________________
// MESSAGES


// Renvoie les messages d'un channel à partir de l'id du channel
// paramètre url : id du channel 
// retourne: tableau de messages dy type: 
app.get('/channels/:id/messages', async (req, res) => {
  
  // Il faut d'abord vérifier si on est autorisé à récupérer les messages du channel
  // <=> on est membre/créateur du channel
  try {
    const channel = await db.channels.get(req.params.id);
    let droit = false;
    for (let i=0; i<channel.idUsers.length ; ++i) {
        if (channel.idUsers[i].id === res.locals.userId) {
          droit = true;
         
        }
    }
    if (channel.creatorId === res.locals.userId) {
        droit = true;
        
    }

    if (droit === true) {
        const messages = await db.messages.list(req.params.id);
        
        res.status(200).json(messages);
    }
    else {
        res.status(403).json("Non autorisé à accéder aux messages de ce channel");
    }
  }
  catch (e) {
    res.status(404).json("error database "+e);
  }


});

// Ajoute un message au channel désigné par son id
// Recoit en paramètre url l'id du channel et en paramètre body le message à ajouter
// retourne le message ajouté
app.post('/channels/:id/messages', async (req, res) => {
  
  // Il faut vérifier qu'on aie le droit d'ajouter un message à ce channel cad qu'on en est membre
  // ou le créateur
  try {
    const channel = await db.channels.get(req.params.id);
    let droit = false;
    for (let i=0; i<channel.idUsers.length ; ++i) {
        if (channel.idUsers[i].id === res.locals.userId) {
          droit = true;
         
        }
    }
    if (channel.creatorId === res.locals.userId) {
        droit = true;
        
    }

    if (droit === true) {
      try {
        const message = await db.messages.create(req.params.id, req.body);
        res.status(201).json(message);
      }catch (e) {
        res.status(404).json("Error database "+e);
      }
    }
    else {
        res.status(403).json("Non autorisé à poster un message dans ce channel");
    }
  }
  catch (e) {
    res.status(404).json("error database "+e);
  }
});

// Supprime l'ensemble des messages du channel désigné par son id
// Reçoit en paramètre URL l'id du channel dont on veut supprimer les messages
app.delete('/channels/:id/messages', async (req, res) => {
  
  // Seul le créateur du channel peut effectuer une telle opération
  try {
    const channel = await db.channels.get(req.params.id);
    let droit = false;
    if (channel.creatorId === res.locals.userId) {
        droit = true;
    }

    if (droit === true) {
        try {
          const data = await db.messages.deleteAll(req.params.id);
          res.status(201).json(data);
        }catch {
            res.status(401).json("Error database : "+e);
        }
    }
    else {
        res.status(403).json("Non autorisé à supprimer les messages de ce channel");
    }
  }
  catch (e) {
    res.status(404).json("error database "+e);
  }
  
});

// Supprimer un message à partir de sa clé (channelId et creationForId)
app.delete('/channels/:id/messages/:creaId', async (req, res) => {
  
  // Seul le créateur du channel est autorisé à supprimer définitvement un message
  // les autres utilisateurs suppriment simplement le contenu (put)
  try {
    const channel = await db.channels.get(req.params.id);
    let droit = false;
    if (channel.creatorId === res.locals.userId) {
        droit = true;
    }

    if (droit === true) {
        try {
            const data = await db.messages.delete(req.params.id,req.params.creaId);
            res.status(201).json(data);
        }
        catch (e) {
            res.status(403).json("Error database: "+e);
        }
    }
    else {
        res.status(403).json("Non autorisé à accéder aux messages de ce channel");
    }
  }
  catch (e) {
    res.status(404).json("error database "+e);
  }
  
});

// modifier le contenu d'un message
// Recoit en paramètre le nouveau message. Les id (channel et creation) sont contenus dans l'objet message
// En paramètre également: le channel
// En paramètre local depuis le middleware: l'id du connected user
app.put('/channels/:id/messages/:creaId', async (req, res) => {

  //Il faut vérifier que je suis l'auteur du message (le seul à pouvoir modifier un message)
  // par modif ou suppression, le créateur du channel ne peut que supprimer avec delete
  if (req.body.author === res.locals.userId) {
      try{
        const data = await db.messages.update(req.body);
        res.status(201).json(data);
      }catch (e) {
        res.status(404).json("Error database: "+e);
      }
  }
});


//____________________________________________________________________
// USERS



// Login
// params: username et mdp
// renvoie: 0 si auth réussie, 1 si username incorrect et 2 si mdp incorrect
// en header: renvoie le token
app.post('/users/login', async (req, res) => {
    const data = await db.users.list();  // Liste des users
    
    // Recup infos de login
    const username = req.body.username;
    const password = req.body.password;

    // Recherche
    let usernameTrouve = 0;
    let passCorrespond = 0;
    let userId = null;
    let userName = null;

    // Vérifier login et password
    for (let i=0; i<data.length; ++i) {
        if (data[i].username === username) {
            usernameTrouve ++;
            userId = data[i].id;
            userName = data[i].username;
    
            if (bcrypt.compareSync(password,data[i].password)) {
                passCorrespond ++;
            }
        }
    }

    if (usernameTrouve > 0 && passCorrespond > 0) 
    {
        const prKey = privateKey;

        // JWT
        var token = jwt.sign(
            { 
                sub: userId,
                userName: userName
            }, 
            privateKey,
            { expiresIn: '1h' }
        );
        res.header('Authorization','Bearer '+token);
     
        res.status(200).json({code:'0',token: token });
    }
    else if (usernameTrouve > 0 && passCorrespond == 0) { 
        res.json({code: '2'});
    }
    else {   
        res.json({code: '1'});
    }

});


// Ajouter un user en BDD
// En paramètres : req = {username: 'user_1'}
// retourne : res = statut et user = { { username: 'user_1', id: 'c50100a8-5fc0-4e62-8ad5-88941325a631' } }
// Vérifie que le user que l'on veut créer n'existe pas dejà
// retourne 200 et l'utilisateur si OK, retourne 1 si email existe et 2 si username existe deja
app.post('/users', async (req, res) => {

  const newUsername = req.body.username;
  const newEmail = req.body.email;
  
  // appel à la db pour lister tous les utilisateurs
  try {
    const userList = await db.users.list();
    // Vérifier que le username et l'email fournis n'existent pas dejà
    let usernameExiste = 0; 
    let emailExiste = 0;

    for (let i=0; i<userList.length; ++i) {
        if (userList[i].username === newUsername) {
            usernameExiste ++;
        }
        if (userList[i].email === newEmail) {
            emailExiste ++;
            
        }
    }

    if (usernameExiste >0) {
      res.json('2');
    }
    else if (emailExiste > 0) {
      res.json('1');
    }
    else {
      // Crypter le mot de passe
      var salt = bcrypt.genSaltSync(10);
      var hashedPwd = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hashedPwd;

      // Ajouter l'utilisateur en BDD 
      const user = await db.users.create(req.body);
      res.status(201).json(user);
    }
  }
  catch (e) {
    res.status(404).json ("Erreur database: "+e);
  }

  

});

// Middleware qui vérifie l'existence du token
// l'ordre des routes est important car les 2 premières routes doivent rester en libre accès
app.use ('/users', async (req,res,next) => {

  // Verifier token dans header
  //console.log (req.headers);
  

  // Si il y a un header 
  if (req.headers.authorization != null) {
    const tokenHeader = req.headers.authorization.split(' ')[1];
    
    let decodedToken ;
    try {
      decodedToken = jwt.verify(tokenHeader,privateKey);
    } 
    catch(e) {
      console.log ("Erreur middleware: "+e);
      res.status(403).json(e);
    }
    finally {
      // Variables qui seront passées au middleware suivants
      res.locals.userId = decodedToken.sub;
      
      
      // passer au middleware/requête suivant
      next();
    }
  }
  // Si pas de header
  else {
    const error = "Middleware: Header manquant";
    console.log (error);
    res.status(401).json(error);
  }
});


// Lister l'ensemble des utilisateurs stockés dans la BDD
// Ne reçoit rien en paramètres dans req
// Retourne un tableau de la forme [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"},{...} ]
app.get('/users', async (req, res) => {
  const users = await db.users.list();
  
  res.json(users);
});



// récupérer un utilisateur à partir de son ID
// Pas de paramètres req, paramètre :id = string
// Retourne : l'utilisateur trouvé sous forme d'objet {"username":"user_1","id":"3af582ad-b589-483c-97a8-290f2712f8d3"}
app.get('/users/:id', async (req, res) => {
  const user = await db.users.get(req.params.id);
  
  res.json(user);
});

// Met a jour les données d'un utilisateur à partir de son id
// En paramètre : l'id de l'utilisateur à mettre à jour et le nouvel objet utilisateur de type {"username":"user_1",...,...}
// Ainsi qu'un booléen indiquant si le mdp a été changé et doit donc de nouveau être encrypté
// Renvoie : l'utilisateur mis à jour, 1 si le mail existe et 2 si le username existe
app.put('/users/:id', async (req, res) => {
    
    // Il faut commencer par vérifier si le mail et le username ne sont pas
    // deja utilisés
    const userList = await db.users.list();

    // Vérifier que le username et l'email fournis n'existent pas dejà
    let usernameExiste = 0; 
    let emailExiste = 0;

    for (let i=0; i<userList.length; ++i) {
       
        if (userList[i].username === req.body.user.username && req.params.id !== userList[i].id ) {
            usernameExiste ++;
        }
        if (userList[i].email === req.body.user.email && req.params.id !== userList[i].id ) {
            emailExiste ++;
        }
    }

    if (usernameExiste >0) {
      res.json('2');
    }
    else if (emailExiste > 0) {
      res.json('1');
    }
    else {
      if (req.body.encrypt === true) {
          var salt = bcrypt.genSaltSync(10);
          var hashedPwd = bcrypt.hashSync(req.body.user.password, salt);
          req.body.user.password = hashedPwd;
      }
    
      const user = await db.users.update(req.params.id,req.body.user);
      res.json(user);
    }
});

module.exports = app
// Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess // test de port cmd
