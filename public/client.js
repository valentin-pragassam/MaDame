var client = io.connect({transports: ['websocket'], upgrade: false, reconnection: false, forceNew: true});

setInterval(function(){
  client.emit('message', {msg: 'hey vincent!'});
}, 3000);

function defy(btn)
{
  console.log("value = " + btn.value);
  client.emit('sendDefy',btn.value);
}

var pseudoTest=null;
/*-----------------------------Affiche pseudo-----------------------*/
client.on('sendPseudo',function(msg){
  var jPseudo = document.getElementById("Pconnect");
  jPseudo.innerHTML = '';
  jPseudo.innerHTML += msg;
  pseudoTest = msg;
}); 

/*---------------------------Liste des user connectés---------------*/
client.on('sendListUsers', function(msg){
  var joueurCo = document.getElementById("Jconnect");
  joueurCo.innerHTML = '';
  for(var user in msg)
  {
    if(user != pseudoTest)
    {
      joueurCo.innerHTML += "<td>"+ user + "<button class='btn-hover color-2' value='"+user+"' onclick='defy(this)'>Ose me défier!</button>" + "<br>";
    }
  }
}); 

/*defier*/
var dataUser = {};

client.on('popup', function(pseudoJ1){
  var txt;
  if (confirm(pseudoJ1 + " vous defie !")) {
    console.log("vous avez accepte");
    client.emit('defiValide',{binary:1, j1:pseudoJ1});
  } 
  else {
    console.log("vous avez refuse!");
    client.emit('defiValide',{binary:0, j1:pseudoJ1});
  }
  
});


client.on('Redirect', function(numJ) {
  document.location.href="multi.html";
}); 
