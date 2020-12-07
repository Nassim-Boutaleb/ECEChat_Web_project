
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

describe('users', () => {
  
  // Vider BDD avant chaque test
  /*beforeEach( async () => {
    await db.admin.clear()
  })*/
  
  it('list empty', async () => {
    // Return an empty user list by default
    const {body: users} = await supertest(app)
    .get('/users')
    .expect(200)
    users.should.eql([])
  })
  
  it('list one element', async () => {
    // Create a user
    await supertest(app)
    .post('/users')
    .send({username: 'user_1'})

    // Ensure we list the users correctly
    const {body: users} = await supertest(app)
    .get('/users')
    .expect(200)

    users.should.match([{
      id: /^\w+-\w+-\w+-\w+-\w+$/,
      username: 'user_1'
    }])
  })
  
  it('add one element', async () => {
    // Créer un nouvel utilisateur en BDD et le stocker dans user
    // On fait appel à la route post/users de express et on lui passe avec send un paramètre {username: 'user_1'}
    // le user retourné est de type: { { username: 'user_1', id: 'c50100a8-5fc0-4e62-8ad5-88941325a631' } }
    const {body: user} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})  // faire passer en para
    .expect(201)
    //Dbg: console.log (user);  // afficher l'utilisateur inséré
    
    // Check its return value
    // Vérifier l'insertion correcte
    // on fait appel à la route get/users qui retorune l'ensemble des users en BDD sous forme de tableau
    // [ {"username":"user_1","id":"8157aa18-0ac8-45e3-ba97-ab42c2336c8b"} ]
    // comme on a qu'un seul élément, on vérifie que la taille du tableau est de 1.
    const {body: users} = await supertest(app)
    .get('/users')
    //console.log ("Tab: "+Array.isArray(users)+"//"+JSON.stringify(users[0])); // dbg  Object.entries (users[0])
    users.length.should.eql(1)
  });
  
  it('get user', async () => {
    // Create a user
    const {body: user1} = await supertest(app)
    .post('/users')
    .send({username: 'user_1'})
    // Check it was correctly inserted
    const {body: user} = await supertest(app)
    .get(`/users/${user1.id}`) // on passe l'id de l'utilisateur ajouté en paramètre
    .expect(200)
    user.username.should.eql('user_1')
  })

  it('list all elements', async () => {
    
    const {body: users} = await supertest(app)
    .get(`/users`) 
    .expect(200)
    for (i=0;i<users.length;++i) {
      console.log (JSON.stringify(users[i]));
    }
  })

  
  
})
