// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var http = require('http');
var server = http.createServer(app);
var uuidv4 = require('uuid/v4');
var session = require("express-session")({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true 
}); 
var sharedsession = require("express-socket.io-session");
var io = require('socket.io').listen(server).set('transports', ['websocket']);

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
      
    },
    debug: true,
});

app.use(session);
io.use(sharedsession(session, {
  autoSave:true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static('views'));

var Joueur = require('./Joueur.js');

var mesBichons = {};

/*---------------------------------------Inscription----------------------------------------*/

app.post('/inscription', async function(req, res) {
 
  var username= req.body.username;
  var password= req.body.password;
  var password_confirm= req.body.password_confirm;
  
  try {

    if (username.length < 1) {  
      console.log("nom d'utilisateur trop court");
      res.redirect("inscription.html");
    } 
    
    else if (password.length < 4){
      console.log("mot de passe trop court");
      res.redirect("inscription.html");
    }
    
    else if(password_confirm != password)
    {
      console.log("mots de passe différents");
      res.redirect("inscription.html");
    }
    
    
   
    else{
      
    var users = await knex('users').where({ 'username' : req.body.username});
    
      if(users.length>0){
            console.log("cet utilisateur existe deja");
            res.redirect("inscription.html");
          }

        else{
          await knex('users').insert({ username : username, password : password});
          req.session.idUser=uuidv4();
          req.session.pseudo=username;
          res.redirect("salon.html");
        }
    }
    
  } catch (err) {console.log("erreur")}
});

/*----------------------------------Connexion----------------------------------*/

async function getUsers(username) {
return await knex('users').where({  
      'username'   : username                                       
    });
}

app.get('/', function(request, response) {
  response.render("index.html");
});


app.post('/connexion', async function(req, res) {
  var username = req.body.login;                  
  var password = req.body.password;
  
  try {
 var users = await knex('users').where({    
      'username'   : username,                      
      'password': password,                       
    });
    
    if (users.length > 0) {                  
      req.session.idUser=uuidv4();
      req.session.pseudo=username;
      res.redirect("salon.html");
    } 
    
    else {
      res.redirect("connexion.html");
  }
  } catch (err) {console.log('user:',users);}
});


/*-------------------------SESSION-----------------------------*/

io.on("connection", function(client) {
    var clientUser = new Joueur(client.handshake.session.idUser, client.handshake.session.pseudo, client);
    mesBichons[clientUser.pseudo] = clientUser;
    client.emit('sendPseudo',clientUser.pseudo);
    io.emit('sendListUsers',mesBichons);
  
    client.on("sendDefy", function(PseudoJ2) {
      mesBichons[PseudoJ2].socket.emit('popup', client.handshake.session.pseudo);
    });
    
    client.on("defiValide",function(msg){
      console.log("Ok " + msg.binary + " " + msg.j1);
      if(msg.binary == 1)
      {
        client.handshake.session.adversaire = msg.j1;
        client.handshake.session.tourJeu = 1;
       
        mesBichons[msg.j1].socket.handshake.session.adversaire = client.handshake.session.pseudo;
        mesBichons[msg.j1].socket.handshake.session.tourJeu = 0;
        mesBichons[msg.j1].socket.handshake.session.save();
        mesBichons[msg.j1].socket.emit('Redirect', 0); // 0 car pion noir
        mesBichons[client.handshake.session.pseudo].socket.emit('Redirect', 1); // 1 car pion blanc (joueur défié commence)
      }
    });
  
  client.on('QuelTour', function(numJ) {
    console.log("tour : " + client.handshake.session.pseudo);
    client.emit('NumTour', client.handshake.session.tourJeu);
  });
  
  client.on('MajCurrent', function(coord) {
    mesBichons[client.handshake.session.adversaire].socket.emit('RetMajCurrent', {row:coord.row, column:coord.column});
  });
  
  client.on('MajDepl', function(coord) {
    mesBichons[client.handshake.session.adversaire].socket.emit('RetMajDepl', {row:coord.row, column:coord.column});
  });
  
  client.on('MajMange', function(coord) {
    mesBichons[client.handshake.session.adversaire].socket.emit('RetMajMange', {row1:coord.row1, column1:coord.column1, row2:coord.row2, column2:coord.column2});
  });
  
  client.on('MajTour', function(bin) {
    mesBichons[client.handshake.session.adversaire].socket.emit('RetMajTour',1);
  });
  
  client.on('MajStop', function(bin) {
    mesBichons[client.handshake.session.adversaire].socket.emit('RetMajStop',1);
  });
  
  client.on('Abandon', function(bin) {
    
    mesBichons[client.handshake.session.adversaire].socket.emit('RetAbandon',1);
  });
  /*------------------------------------DECONNEXION--------------------------------------*/
  
    client.on("disconnect", function(userdata) {
        if(client.handshake.session.adversaire != '') // Il etait en partie et a declaré forfait
        {
          console.log(client.handshake.session.pseudo + " a declaré forfait, " + client.handshake.session.adversaire + " gagne");
        }
        console.log("déconnexion");
        console.log(client.handshake.session.pseudo);
        delete mesBichons[client.handshake.session.pseudo];
        io.emit('sendListUsers', {listUsers : mesBichons});
  });
});


  
// listen for requests :)
var listener = server.listen(process.env.PORT);
  console.log('Your app is listening on port ' + listener.address().port);

  
