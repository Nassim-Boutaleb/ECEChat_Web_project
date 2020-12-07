
const db = require('./db')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(require('body-parser').json());
app.use(cors());

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
});

// Channels

app.get('/channels', async (req, res) => {
  const channels = await db.channels.list()
  res.json(channels)
});

app.post('/channels', async (req, res) => {
  const channel = await db.channels.create(req.body)
  res.status(201).json(channel)
});

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
});

app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.body)
  res.json(channel)
});

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
});

app.post('/channels/:id/messages', async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body)
  res.status(201).json(message)
});

// Users

// Lister l'ensemble des utilisateurs stockés dans la BDD
// Ne reçoit rien en paramètres dans req
// Retourne un tableau de la forme [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"},{...} ]
app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
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
  res.json(user);
});

// TODO
app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.body)
  res.json(user)
});

module.exports = app
