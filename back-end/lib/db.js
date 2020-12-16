
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
  channels: {
    
    //Creation d'un channel en BDD
    // Recoit en paramètre le contenu du channel sous forme d'objet {name:"channel1"}
    // et l'id de l'utilisateur qui a créé le channel (une string)
    // et userList la liste des utilisateurs {id:"tere",username:"MB"}
    create: async ({channel,userList},idUser) => {
      console.log ("DB create channel: "+JSON.stringify(channel));
      if(!channel.name) throw Error('Invalid channel');
      if(!idUser) throw Error ('No id provided');

      const id = uuid(); // définir un id pour le channel

      const idUsers = []; 
      // ajouter les ID contenus dans userList à idUsers 
      for (let i=0; i<userList.length; ++i) {
        idUsers.push (userList[i].id);
      }
      //idUsers.push(idUser);  // finalement le créateur sera en creator (super admin)
      console.log ("BDD:Idusers: "+idUsers);

      const channelP = merge (channel,{idUsers: idUsers,creatorId: idUser});
      console.log (channelP);

      await db.put(`channels:${id}`, JSON.stringify(channelP))
      return merge(channelP, {id: id})
    },

    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      return merge(channel, {id: id})
    },

    list: async () => {
      return new Promise( (resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          channels.push(channel)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(channels)
        })
      })
    },

    update: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      store.channels[id] = merge(original, channel)
    },

    delete: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      delete store.channels[id]
    }
  },

//____________________________________________________________________________

  messages: {
    
    // Crée un message à partir du channel id passé en paramètre
    // Paramètres: channelID id du channel (string)
    // et message objet de forme {author:"david","content":"bonjour"}
    create: async (channelId, message) => {
      console.log ("DB create message: "+JSON.stringify(message)+" "+message.author);
      if(!channelId) throw Error('Invalid channel')
      if(!message.author) throw Error('Invalid message no author')
      if(!message.content) throw Error('Invalid message no content')
      creation = microtime.now() // date de création du message (instant actuel)
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }))
      return merge(message, {channelId: channelId, creation: creation})
    },

    // Renvoie un tableau de messages à partir de l'id du channel passé en paramètre
    list: async (channelId) => {
      return new Promise( (resolve, reject) => {
        const messages = []; // la liste des messages

        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value); // Le message, objet de type {author:'XXX',content:'blabla'}
          const [, channelId, creation] = key.split(':') // 3 parties de la clé: '"messages"','$channelId','$creation'
          message.channelId = channelId;
          message.creation = creation;
          messages.push(message);
        }).on( 'error', (err) => {
          reject(err);
        }).on( 'end', () => {
          resolve(messages);
        })
      })
    },
  },

//_________________________________________________________________________________________

  users: {

    // Ajoute un user en BDD
    // Paramètre : user = {username: 'user_1'}
    // retourne :  { { username: 'user_1', id: 'c50100a8-5fc0-4e62-8ad5-88941325a631' } }
    // En BDD on a : users:8ca7a37b-6573-4dc3-a99f-90868573fd5b {"username":"user_1","password":"yy","email":"xx"}
    create: async (user) => {
      if(!user.username) throw Error('Invalid user')
      const id = uuid()
      //console.log ("BD: "+`users:${id}`, JSON.stringify(user));
      await db.put(`users:${id}`, JSON.stringify(user))
      //console.log ("DBR: "+JSON.stringify(merge(user, {id: id} ))); //dbg
      return merge(user, {id: id})
    },

    // Recherche et renvoie un utilisateur à partir de son id
    // Paramètre : l'id (string)
    // retourne: l'utilisateur trouvé sous forme d'objet de type {"username":"user_1","id":"3af582ad-b589-483c-97a8-290f2712f8d3"}
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const user = JSON.parse(data)
      return merge(user, {id: id})
    },
    
    // Lister l'enseble des utilisateurs stockés en BDD
    // Retourne un tableau de la forme : [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"},{...} ]
    list: async () => {
      return new Promise( (resolve, reject) => {
        const users = [];  // stocker tous les utilisateurs
        
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)  // stocker l'utilisateur trouvé dans la liste des utilisateurs
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(users)
        })
      });
    },

    // Met à jour les données d'un utilisateur à partir de son ID
    // En paramètre: l'id de l'utilisateur et le nouvel objet utilisateur
    update: async (id, user) => {
      if(!user.username) throw Error('Invalid user');
      if(!id) throw Error ('No id provided');
  
      //console.log ("BD: "+`users:${id}`, JSON.stringify(user));
      await db.put(`users:${id}`, JSON.stringify(user))
      //console.log ("DBR: "+JSON.stringify(merge(user, {id: id} ))); //dbg
      return merge(user, {id: id})
    },

    // TODO
    delete: (id, user) => {
      const original = store.users[id]
      if(!original) throw Error('Unregistered user id')
      delete store.users[id]
    }
  },

  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}
