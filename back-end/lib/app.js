
const privateKey = require ( './../../front-end/src/privateKey');
const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

app.use(require('body-parser').json());
app.use(cors());

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
});

// Channels

// Middleware systématiquement appelé avant toute autre requête vers channels
// vérifie la validité du token d'identification passé via le header authorization
app.use ('/channels', async (req,res,next) => {
  console.log ("On use");
  // Verifier token dans header
  //console.log (req.headers);
  

  // Si il y a un header 
  if (req.headers.authorization != null) {
    const tokenHeader = req.headers.authorization.split(' ')[1];
    //console.log (tokenHeader);
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
      //console.log ("MCT: "+res.locals.userId)
      
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
  console.log ("On get");
  const userId = res.locals.userId; // id de l'utilisateur connecté dont on veut lister les channels
  
  const channels = await db.channels.list(); // récupérer tous les channels de l'appli
  const channelsOfUser = [];  // on mettra les channels de l'utilisateur connecté ici
  //console.log ("back channels: "+JSON.stringify(channels));


  // Channels est un tableau de channel du type [{name:"channel1",idUsers:['x54r','ppo6'],creatorID:xgsg,id:pxo}]
  // On parcourt le tableau de channels puis le sous-tableau des users du channel
  // Si l'id de notre user est trouvé ds la liste des users du channel: on garde le channel 
  // de même si l'id de notre user est trouvé comme étant le créateur du channel

  for (var i=0; i< channels.length; ++i) {
      for (j=0; j<channels[i].idUsers.length; j++) {
          //console.log ("jaja: "+channels[i].idUsers[j]+" i= "+i);
          if (channels[i].idUsers[j] === userId) {
              //console.log ("On push");
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
app.get('/allChannels', async (req, res) => {
  console.log ("Get all channels");
  const channels = await db.channels.list()
  res.json(channels)
});


// Crée un channel en base de données 
// En paramètre: l'objet channel de type {name:"channel 1"}
// Reçoit du middleware d'identification res.locals.userId => id du user qui a créé le channel
// retourne le channel créé
app.post('/channels', async (req, res) => {
  const userId = res.locals.userId; // id de l'utilisateur qui a créé le channel
  console.log ("CreationchannelBACK: "+userId);
  console.log ("\nCreationchannelBACK-CHANNEL: "+JSON.stringify(req.body.channel));
  console.log ("\nCreationchannelBACK-USERLIST: "+JSON.stringify(req.body.userList));
  const channel = await db.channels.create(req.body,userId);
  res.status(201).json(channel);
});

// Renvoie un channel à partir de son id
// en paramètre : l'id du channel à retrouver
// Revoie: un channel sous la forme {name:"XYZ"}
app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

// Met a jour le channel désigné par son id
// En paramètres: l'id du channel à mettre à jour et le contenu du nouveau channel sous forme d'objet
// Renvoie le channel mis à jour
// TODO
app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.params.id,req.body);
  res.json(channel);
});

//______________________________________________________________

// Messages
// Renvoie les messages d'un channel à partir de l'id du channel
// paramètre url : id du channel 
// retourne: tableau de messages dy type: 
app.get('/channels/:id/messages', async (req, res) => {
  const messages = await db.messages.list(req.params.id);
  console.log ("Back messages get: "+messages);
  res.json(messages);
});

// Ajoute un message au channel désigné par son id
// Recoit en paramètre url l'id du channel et en paramètre body le message à ajouter
// retourne le message ajouté
app.post('/channels/:id/messages', async (req, res) => {
  console.log ("back message.post :"+JSON.stringify(req.body));
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);
});

//____________________________________________________________________

// Users

// Lister l'ensemble des utilisateurs stockés dans la BDD
// Ne reçoit rien en paramètres dans req
// Retourne un tableau de la forme [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"},{...} ]
app.get('/users', async (req, res) => {
  const users = await db.users.list();
  console.log ("mauvais back: "+JSON.stringify(users));
  res.json(users);
});

// Ajouter un user en BDD
// En paramètres : req = {username: 'user_1'}
// retourne : res = statut et user = { { username: 'user_1', id: 'c50100a8-5fc0-4e62-8ad5-88941325a631' } }
app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body);
  res.status(201).json(user);
});

// récupérer un utilisateur à partir de son ID
// Pas de paramètres req, paramètre :id = string
// Retourne : l'utilisateur trouvé sous forme d'objet {"username":"user_1","id":"3af582ad-b589-483c-97a8-290f2712f8d3"}
app.get('/users/:id', async (req, res) => {
  const user = await db.users.get(req.params.id);
  console.log ("back: "+JSON.stringify(user));
  res.json(user);
});

// Met a jour les données d'un utilisateur à partir de son id
// En paramètre : l'id de l'utilisateur à mettre à jour et le nouvel objet utilisateur de type {"username":"user_1","id":"3af582ad-b589-483c-97a8-290f2712f8d3",...}
// Renvoie : l'utilisateur mis à jour
app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.params.id,req.body)
  res.json(user)
});

module.exports = app
// Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess // test de port
