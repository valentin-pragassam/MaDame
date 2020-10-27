var div=document.querySelector("#Tab1");
div.innerHTML='';
var pas, pas2;
var larg=10, long=10;

var table=document.createElement('table');
var tableau=[];
  
for(pas=0; pas<10; pas++){
  var tr=document.createElement('tr');
  tableau[pas]=tr;
  for(pas2=0; pas2<10; pas2++){
    
    var td=document.createElement('td');
    tableau[pas][pas2]=td;
    td.dataset.column = pas2;
    td.dataset.row = pas;
    tr.appendChild(td);
  }
  table.appendChild(tr);
}

div.appendChild(table);

for(pas=0; pas<10; pas++){
  for(pas2=0; pas2<10; pas2++){
    if((parseInt(pas)+parseInt(pas2))%2==0){
      tableau[pas][pas2].className='CasePaire';
    }
    else{
      tableau[pas][pas2].className='CaseImpaire';
    }
  }
}
var tourDeJeu;
var tourJeu; /* Blancs commencent */

client.emit('QuelTour', pseudoTest);

client.on('NumTour', function(numJ) {
  tourDeJeu = numJ;
  if(tourDeJeu==1) console.log("Vous etes les blancs !");
  else console.log("Vous etes les noirs !");
});

function InitPions(){
  tourJeu=1;
  nbBlanc=20;
  nbNoir=20;
  for(pas=0; pas<10; pas++){
    for(pas2=0; pas2<10; pas2++){
      if((pas+pas2)%2!=0){
        if(pas<4){
          tableau[pas][pas2].className='PionNoir';
          tableau[pas][pas2].style.backgroundColor = "black";
        }
        else if(pas>5){
          tableau[pas][pas2].className='PionBlanc';
          tableau[pas][pas2].style.backgroundColor = "white";
        }
        else{
          tableau[pas][pas2].className='CaseImpaire';
          tableau[pas][pas2].style.backgroundColor = "#a97121";
        }
      }
    }
  }
}

InitPions();

console.log("Les blancs commencent ! | " +  tourJeu);
var mouse = document.querySelector('table');

var currentRow = 0;
var currentColumn = 0;
var nbEat; /* Combien de pions peut le pion actuel manger ? */
var nbDep; /* Combien de deplacements simple peut le pion actuel effectuer ? */
var nbEat2 = 0;
var grille = new Array(10);
var aMange=0;
var nbBlanc=20;
var nbNoir=20;
for(var i=0; i<10; i++){
  grille[i] = new Array(10);
  for(var j=0; j<10; j++){
    grille[i][j] = 0;
  }
}

console.log(nbNoir + nbBlanc);
var S1 = document.getElementById("scoreJ1");
var S2 = document.getElementById("scoreJ2");
console.log("S1 : " + S1 + " | S2 : " + S2);
S1.innerHTML = '';
S1.innerHTML += "<h1>" + nbBlanc + "</h1>";
S2.innerHTML = '';
S2.innerHTML += "<h1>" + nbNoir + "</h1>";

function ChangeTour(){
  tourJeu = (tourJeu+1)%2;
  if(tourJeu==1) console.log("Au tour des blancs !");
  else console.log("Au tour des noirs !");
}

function SurvolPionOn(eventOver){
  if(((eventOver.target.className=='PionNoir' || eventOver.target.className=='DameNoir') && parseInt(tourJeu)==0 && tourDeJeu==tourJeu) || ((eventOver.target.className=='PionBlanc' || eventOver.target.className=='DameBlanc') && parseInt(tourJeu)==1 && tourDeJeu==tourJeu)){
    eventOver.target.style.borderWidth = '3px';
    eventOver.target.style.borderColor = "#ede604";
    eventOver.target.style.animation = 'shake 0.8s';
    eventOver.target.style.animationIterationCount = 'infinite';
  }
}

function SurvolPionOff(eventOut){
  eventOut.target.style.borderWidth = '3px';
  eventOut.target.style.borderColor = "#a97121";
  eventOut.target.style.animation = 'null';
}

function StopJeu(){
  if(nbNoir == 0 || nbBlanc == 0)
  {
    client.emit('MajStop', 1); 
  }
  
  if(nbNoir == 0){
    const message = "Les blancs gagnent ! Veuillez relancer une partie";
    if(window.confirm(message)){
      InitPions();
    }
  }
  else if(nbBlanc == 0){
    const message = "Les noirs gagnent ! Veuillez relancer une partie";
    if(window.confirm(message)){
      InitPions();
    }
  }
}
function ClickPion(eventOn){
  CheckMange(0); // On verifie si des pions sont obligés de manger
  console.log("Start tj = " + tourJeu + "  |  tDj = " + tourDeJeu);
  if(((eventOn.target.className=='PionNoir' || eventOn.target.className=='DameNoir') && tourJeu==0 && tourDeJeu==tourJeu) || ((eventOn.target.className=='PionBlanc' || eventOn.target.className=='DameBlanc') && tourJeu==1 && tourDeJeu==tourJeu)){// Click sur blanc ou noir
    console.log("Affichage nb2 = " + nbEat2);
    if(nbEat2==0 || (nbEat2!=0 && grille[parseInt(eventOn.target.dataset.row)][parseInt(eventOn.target.dataset.column)]==1)){ // Soit ce pion peut manger ou pas (permet de ne pas selectionné un pion alors qu'un autre peut manger)
      if(tableau[currentRow][currentColumn].className=='PionNoir') tableau[currentRow][currentColumn].style.backgroundColor = "black"; // Si ancien pion est noir on le remet noir
      else if(tableau[currentRow][currentColumn].className=='PionBlanc') tableau[currentRow][currentColumn].style.backgroundColor = "white"; // Ou blanc
      if((tableau[currentRow][currentColumn].className=='PionNoir' || tableau[currentRow][currentColumn].className=='DameNoir') || (tableau[currentRow][currentColumn].className=='PionBlanc' || tableau[currentRow][currentColumn].className=='DameBlanc')){ // Enleve les anciennes dispo du pion precedent
        ChoixDispo(currentRow, currentColumn, 1); 
      }
      currentRow=eventOn.target.dataset.row; // Nouvelles coord du pion select (lign)
      currentColumn=eventOn.target.dataset.column; // colonne
      if(tableau[currentRow][currentColumn].className=='PionBlanc') eventOn.target.style.backgroundColor = "#d3d1d1"; // On selectionne un blanc
      else if(tableau[currentRow][currentColumn].className=='PionNoir') eventOn.target.style.backgroundColor = "#353535"; // Un noir
      eventOn.target.style.borderColor = "#ede604";
      console.log("Affichage");
      ChoixDispo(currentRow, currentColumn, 0); // Affiche les coups jouables
    }
  }
  else if(eventOn.target.className=='PionPossible'){
    ChoixDispo(currentRow, currentColumn, 1); /* Retire les choix du pion précédent */
    DeplacePion(eventOn.target.dataset.row, eventOn.target.dataset.column); /* Déplace le pion */
    client.emit('MajCurrent', {row: currentRow, column: currentColumn}); 
    client.emit('MajDepl', {row: eventOn.target.dataset.row, column: eventOn.target.dataset.column});
    if((((parseInt(eventOn.target.dataset.row)-parseInt(currentRow))>1) || ((parseInt(eventOn.target.dataset.row)-parseInt(currentRow))<-1)) && nbEat2!=0){ // On mange un pion (écart entre départ et arrivé de 2 cases en diag)
      MangePion(eventOn.target.dataset.row, eventOn.target.dataset.column, currentRow, currentColumn);
      client.emit('MajMange', {row1: eventOn.target.dataset.row, column1: eventOn.target.dataset.column, row2: currentRow, column2: currentColumn});
      aMange=1;
      nbEat2 = 0;
      currentRow=eventOn.target.dataset.row;
      currentColumn=eventOn.target.dataset.column;
      CheckMange(0); // On check si on peut de nouveau manger
    }
    currentRow=eventOn.target.dataset.row;
    currentColumn=eventOn.target.dataset.column;
    if(nbEat2==0){
      ChangeTour();
      client.emit('MajTour', 1);
      console.log("tj = " + tourJeu + "  |  tDj = " + tourDeJeu);
      aMange = 0;
    }
    CheckMange(1); // On reinit le tableau (qui check les possibilités de manger)
    StopJeu();
  }
}

function MangePion(row1, column1, row2, column2){
  console.log(tableau[row1][column1].className);
  if(tableau[row1][column1].className!='DameBlanc' && tableau[row1][column1].className!='DameNoir'){
    var newRow = (parseInt(row1)+parseInt(row2))/2;
    var newColumn = (parseInt(column1)+parseInt(column2))/2;
    if((tableau[parseInt(newRow)][parseInt(newColumn)].className=='PionBlanc' || tableau[parseInt(newRow)][parseInt(newColumn)].className=='DameBlanc')){
      nbBlanc--;
      S1.innerHTML = '';
      S1.innerHTML += "<h1>" + nbBlanc + "</h1>";
    }
    else{
      nbNoir--;
      S2.innerHTML = '';
      S2.innerHTML += "<h1>" + nbNoir + "</h1>";
    }
    tableau[parseInt(newRow)][parseInt(newColumn)].className='CaseImpaire';
    tableau[parseInt(newRow)][parseInt(newColumn)].style.backgroundColor = "#a97121";
  }
  else{
    if (tableau[row1][column1].className=='DameBlanc'){
      nbNoir--;
      S2.innerHTML = '';
      S2.innerHTML += "<h1>" + nbNoir + "</h1>";
    }
    else{
      nbBlanc--;
      S1.innerHTML = '';
      S1.innerHTML += "<h1>" + nbBlanc + "</h1>";
    }
    var index = 1;
    if(parseInt(row2)-parseInt(row1)>0){ // haut
      if(parseInt(column2)-parseInt(column1)>0){ // gauche
        while(tableau[parseInt(row2)-parseInt(index)][parseInt(column2)-parseInt(index)].className=='CaseImpaire'){
          index++;
        }
        
        tableau[parseInt(row2)-parseInt(index)][parseInt(column2)-parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row2)-parseInt(index)][parseInt(column2)-parseInt(index)].style.backgroundColor = "#a97121";
      }
      else{ // droite
        while(tableau[parseInt(row2)-parseInt(index)][parseInt(column2)+parseInt(index)].className=='CaseImpaire'){
          index++;
        }
        tableau[parseInt(row2)-parseInt(index)][parseInt(column2)+parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row2)-parseInt(index)][parseInt(column2)+parseInt(index)].style.backgroundColor = "#a97121";
      }
    }
    else{ // bas
      if(parseInt(column2)-parseInt(column1)>0){ // gauche
        while(tableau[parseInt(row2)+parseInt(index)][parseInt(column2)-parseInt(index)].className=='CaseImpaire'){
          index++;
        }
        tableau[parseInt(row2)+parseInt(index)][parseInt(column2)-parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row2)+parseInt(index)][parseInt(column2)-parseInt(index)].style.backgroundColor = "#a97121";
      }
      else{ // droite
        while(tableau[parseInt(row2)+parseInt(index)][parseInt(column2)+parseInt(index)].className=='CaseImpaire'){
          index++;
        }
        tableau[parseInt(row2)+parseInt(index)][parseInt(column2)+parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row2)+parseInt(index)][parseInt(column2)+parseInt(index)].style.backgroundColor = "#a97121";
      }
    }
  }
}

function DeplacePion(row, column){
  if(tableau[currentRow][currentColumn].className=='PionNoir' && row==9){
    tableau[row][column].className='DameNoir';
  }
  else if(tableau[currentRow][currentColumn].className=='PionBlanc' && row==0){
    tableau[row][column].className='DameBlanc';
  }
  else{
    tableau[row][column].className=tableau[currentRow][currentColumn].className;
    if(tableau[row][column].className=='PionNoir') tableau[row][column].style.backgroundColor = "black";
    else if(tableau[row][column].className=='PionBlanc') tableau[row][column].style.backgroundColor = "white";
  }
  tableau[currentRow][currentColumn].className='CaseImpaire';
  tableau[currentRow][currentColumn].style.backgroundColor = "#a97121";
}

function ChoixDispo(row, column, bin){
  nbEat=0;
  nbDep=0;
  if(tableau[row][column].className=='PionNoir'){
    if(row<9 && nbEat2==0){  /* deplacement d'une case en diag seulement si on ne peut pas manger*/
      if(column>0){ /* Test diag bas gauche */
        if(tableau[parseInt(row)+1][parseInt(column)-1].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+1][parseInt(column)-1].className='PionPossible';
          tableau[parseInt(row)+1][parseInt(column)-1].style.backgroundColor = '#1ec800';
          nbDep++;
        }
        else if(tableau[parseInt(row)+1][parseInt(column)-1].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+1][parseInt(column)-1].className='CaseImpaire';
          tableau[parseInt(row)+1][parseInt(column)-1].style.backgroundColor = "#a97121";
        }
      }
      if(column<9){ /* Test diag bas droite */
        if(tableau[parseInt(row)+1][parseInt(column)+1].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+1][parseInt(column)+1].className='PionPossible';
          tableau[parseInt(row)+1][parseInt(column)+1].style.backgroundColor = '#1ec800';
          nbDep++;
        }
        else if(tableau[parseInt(row)+1][parseInt(column)+1].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+1][parseInt(column)+1].className='CaseImpaire';
          tableau[parseInt(row)+1][parseInt(column)+1].style.backgroundColor = "#a97121";
        }
      }
    }
    if(row<8){ /* test de manger vers le bas */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)-2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+2][parseInt(column)-2].className='PionPossible';
          tableau[parseInt(row)+2][parseInt(column)-2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)-2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+2][parseInt(column)-2].className='CaseImpaire';
          tableau[parseInt(row)+2][parseInt(column)-2].style.backgroundColor = '#a97121';
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)+2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+2][parseInt(column)+2].className='PionPossible';
          tableau[parseInt(row)+2][parseInt(column)+2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)+2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+2][parseInt(column)+2].className='CaseImpaire';
          tableau[parseInt(row)+2][parseInt(column)+2].style.backgroundColor = '#a97121';
        }
      }
    }
    if(row>1){ /* test de manger vers le haut */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)-2][parseInt(column)-2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)-2][parseInt(column)-2].className='PionPossible';
          tableau[parseInt(row)-2][parseInt(column)-2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)-2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-2][parseInt(column)-2].className='CaseImpaire';
          tableau[parseInt(row)-2][parseInt(column)-2].style.backgroundColor = '#a97121';
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)-2][parseInt(column)+2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)-2][parseInt(column)+2].className='PionPossible';
          tableau[parseInt(row)-2][parseInt(column)+2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)-2][parseInt(column)+2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-2][parseInt(column)+2].className='CaseImpaire';
          tableau[parseInt(row)-2][parseInt(column)+2].style.backgroundColor = '#a97121';
        }
      }
    }
  }
  else if(tableau[row][column].className=='PionBlanc'){
    if(row>0 && nbEat2==0){
      if(column>0){ /* Test diag haut gauche */
        if(tableau[parseInt(row)-1][parseInt(column)-1].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)-1][parseInt(column)-1].className='PionPossible';
          tableau[parseInt(row)-1][parseInt(column)-1].style.backgroundColor = '#1ec800';
          nbDep++;
        }
        else if(tableau[parseInt(row)-1][parseInt(column)-1].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-1][parseInt(column)-1].className='CaseImpaire';
          tableau[parseInt(row)-1][parseInt(column)-1].style.backgroundColor = "#a97121";
        }
      }
      if(column<9){ /* Test diag haut droite */
        if(tableau[parseInt(row)-1][parseInt(column)+1].className=='CaseImpaire' && bin==0){
            tableau[parseInt(row)-1][parseInt(column)+1].className='PionPossible';
            tableau[parseInt(row)-1][parseInt(column)+1].style.backgroundColor = '#1ec800';
            nbDep++;
        }
        else if(tableau[parseInt(row)-1][parseInt(column)+1].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-1][parseInt(column)+1].className='CaseImpaire';
          tableau[parseInt(row)-1][parseInt(column)+1].style.backgroundColor = "#a97121";
        }
      }
    }
    if(row<8){ /* test de manger vers le bas */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)-2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+2][parseInt(column)-2].className='PionPossible';
          tableau[parseInt(row)+2][parseInt(column)-2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)-2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+2][parseInt(column)-2].className='CaseImpaire';
          tableau[parseInt(row)+2][parseInt(column)-2].style.backgroundColor = '#a97121';
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)+2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)+2][parseInt(column)+2].className='PionPossible';
          tableau[parseInt(row)+2][parseInt(column)+2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)+2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)+2][parseInt(column)+2].className='CaseImpaire';
          tableau[parseInt(row)+2][parseInt(column)+2].style.backgroundColor = '#a97121';
        }
      }
    }
    if(row>1){ /* test de manger vers le haut */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)-2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)-2][parseInt(column)-2].className='PionPossible';
          tableau[parseInt(row)-2][parseInt(column)-2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)-2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-2][parseInt(column)-2].className='CaseImpaire';
          tableau[parseInt(row)-2][parseInt(column)-2].style.backgroundColor = '#a97121';
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)+2].className=='CaseImpaire' && bin==0){
          tableau[parseInt(row)-2][parseInt(column)+2].className='PionPossible';
          tableau[parseInt(row)-2][parseInt(column)+2].style.backgroundColor = '#1ec800';
        }
        else if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)+2].className=='PionPossible' && bin!=0){
          tableau[parseInt(row)-2][parseInt(column)+2].className='CaseImpaire';
          tableau[parseInt(row)-2][parseInt(column)+2].style.backgroundColor = '#a97121';
        }
      }
    }
  }
  if((tableau[row][column].className=='DameNoir' && tourJeu== 0) || (tableau[row][column].className=='DameBlanc' && tourJeu==1)){
    var index=1;
    var nbPionAdv = 0;
    var nbPionAll = 0;
    while(parseInt(row)+parseInt(index)<10 && parseInt(column)+parseInt(index)<10){  // Diag bas droite 
      if((tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='CaseImpaire' && bin==0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className='PionPossible';
        tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].style.backgroundColor = '#1ec800';
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='DameNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='DameNoir')){
        // Pion allié (dame ou pion noir)
        nbPionAll++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion allié (dame ou pion blanc)
        nbPionAll++;
      }
      else if((tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionPossible' && bin!=0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].style.backgroundColor = '#a97121';
      }
      index++;
      if(nbPionAdv>1 || nbPionAll>0) index = 10;
    }
    index = 1;
    nbPionAdv = 0;
    nbPionAll = 0;
    while(parseInt(row)+parseInt(index)<10 && parseInt(column)-parseInt(index)>=0){  // Diag bas gauche
      if((tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='CaseImpaire' && bin==0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className='PionPossible';
        tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].style.backgroundColor = '#1ec800';
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='DameNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='DameNoir')){
        // Pion allié (dame ou pion noir)
        nbPionAll++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion allié (dame ou pion blanc)
        nbPionAll++;
      }
      else if((tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionPossible' && bin!=0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].style.backgroundColor = '#a97121';
      }
      index++;
      if(nbPionAdv>1 || nbPionAll>0) index = 10;
    }
    index=1;
    nbPionAdv = 0;
    nbPionAll = 0;
    while(parseInt(row)-parseInt(index)>=0 && parseInt(column)-parseInt(index)>=0){  // Diag haut gauche
      if((tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='CaseImpaire' && bin==0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className='PionPossible';
        tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].style.backgroundColor = '#1ec800';
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='DameNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='DameNoir')){
        // Pion allié (dame ou pion noir)
        nbPionAll++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion allié (dame ou pion blanc)
        nbPionAll++;
      }
      else if((tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionPossible' && bin!=0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].style.backgroundColor = '#a97121';
      }
      index++;
      if(nbPionAdv>1 || nbPionAll>0) index = 10;
    }
    index=1;
    nbPionAdv = 0;
    nbPionAll = 0;
    while(parseInt(row)-parseInt(index)>=0 && parseInt(column)+parseInt(index)<10){  // Diag haut droite
      if((tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='CaseImpaire' && bin==0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className='PionPossible';
        tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].style.backgroundColor = '#1ec800';
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='DameNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
      }
      else if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='DameNoir')){
        // Pion allié (dame ou pion noir)
        nbPionAll++;
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion allié (dame ou pion blanc)
        nbPionAll++;
      }
      else if((tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionPossible' && bin!=0) && ((nbPionAdv<1 && nbEat2==0) || nbPionAdv>0 && nbEat2!=0)){
        tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className='CaseImpaire';
        tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].style.backgroundColor = '#a97121';
      }
      index++;
      if(nbPionAdv>1 || nbPionAll>0) index = 10;
    }
  }
}

function ChoixDispo2(row, column){
  nbEat=0;
  nbDep=0;
  if(tableau[row][column].className=='PionNoir'){
    if(row<8){ /* test de manger vers le bas */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)-2].className=='CaseImpaire'){
          nbEat++;
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)+2][parseInt(column)+2].className=='CaseImpaire'){
          nbEat++;
        }
      }
    }
    if(row>1){ /* test de manger vers le haut */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameBlanc') && tableau[parseInt(row)-2][parseInt(column)-2].className=='CaseImpaire'){
          nbEat++;
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionBlanc' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameBlanc') && tableau[parseInt(row)-2][parseInt(column)+2].className=='CaseImpaire'){
          nbEat++;
        }
      }
    }
  }
  else if(tableau[row][column].className=='PionBlanc'){
    if(row<8){ /* test de manger vers le bas */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)+1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)-2].className=='CaseImpaire'){
          nbEat++;
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)+1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)+1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)+2][parseInt(column)+2].className=='CaseImpaire'){
          nbEat++;
        }
      }
    }
    if(row>1){ /* test de manger vers le haut */
      if(column>1){ /* gauche */
        if((tableau[parseInt(row)-1][parseInt(column)-1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)-1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)-2].className=='CaseImpaire'){
          nbEat++;
        }
      }
      if(column<8){ /* droite */
        if((tableau[parseInt(row)-1][parseInt(column)+1].className=='PionNoir' || tableau[parseInt(row)-1][parseInt(column)+1].className=='DameNoir') && tableau[parseInt(row)-2][parseInt(column)+2].className=='CaseImpaire'){
          nbEat++;
        }
      }
    }
  }
  else if((tableau[row][column].className=='DameNoir' && tourJeu== 0) || (tableau[row][column].className=='DameBlanc' && tourJeu==1)){
    var index=1;
    var nbPionAdv = 0;
    while(parseInt(row)+parseInt(index)<10 && parseInt(column)+parseInt(index)<10){  // Diag bas droite 
      if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
        if(parseInt(row)+parseInt(index)<10 && parseInt(column)+parseInt(index)<9){
          if(tableau[parseInt(row)+parseInt(index)+1][parseInt(column)+parseInt(index)+1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
        if(parseInt(row)+parseInt(index)<10 && parseInt(column)+parseInt(index)<9){
          if(tableau[parseInt(row)+parseInt(index)+1][parseInt(column)+parseInt(index)+1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      index++;
      if(nbPionAdv>0) index = 10;
    }
    index = 1;
    nbPionAdv = 0;
    while(parseInt(row)+parseInt(index)<10 && parseInt(column)-parseInt(index)>=0){  // Diag bas gauche
      if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
        if(parseInt(row)+parseInt(index)<9 && parseInt(column)-parseInt(index)>0){
          if(tableau[parseInt(row)+parseInt(index)+1][parseInt(column)-parseInt(index)-1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)+parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
        if(parseInt(row)+parseInt(index)<9 && parseInt(column)-parseInt(index)>0){
          if(tableau[parseInt(row)+parseInt(index)+1][parseInt(column)-parseInt(index)-1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      index++;
      if(nbPionAdv>0) index = 10;
    }
    index=1;
    nbPionAdv = 0;
    while(parseInt(row)-parseInt(index)>=0 && parseInt(column)-parseInt(index)>=0){  // Diag haut gauche
      if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
        if(parseInt(row)-parseInt(index)>0 && parseInt(column)-parseInt(index)>0){
          if(tableau[parseInt(row)-parseInt(index)-1][parseInt(column)-parseInt(index)-1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)-parseInt(index)].className=='PionNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
        if(parseInt(row)-parseInt(index)>0 && parseInt(column)-parseInt(index)>0){
          if(tableau[parseInt(row)-parseInt(index)-1][parseInt(column)-parseInt(index)-1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      index++;
      if(nbPionAdv>0) index = 10;
    }
    index=1;
    nbPionAdv = 0;
    while(parseInt(row)-parseInt(index)>=0 && parseInt(column)+parseInt(index)<10){  // Diag haut droite
      if(tableau[row][column].className=='DameNoir' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionBlanc' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='DameBlanc')){
        // Pion adverse (dame ou pion blanc)
        nbPionAdv++;
        if(parseInt(row)-parseInt(index)>0 && parseInt(column)+parseInt(index)<9){
          if(tableau[parseInt(row)-parseInt(index)-1][parseInt(column)+parseInt(index)+1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      else if(tableau[row][column].className=='DameBlanc' && (tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir' || tableau[parseInt(row)-parseInt(index)][parseInt(column)+parseInt(index)].className=='PionNoir')){
        // Pion adverse (dame ou pion noir)
        nbPionAdv++;
        if(parseInt(row)-parseInt(index)>0 && parseInt(column)+parseInt(index)<9){
          if(tableau[parseInt(row)-parseInt(index)-1][parseInt(column)+parseInt(index)+1].className=='CaseImpaire'){
            nbEat++;
          }
        }
      }
      index++;
      if(nbPionAdv>0) index = 10;
    }
  }
}

function CheckMange(x){
  for(var i=0; i<10; i++){
    for(var j=0; j<10; j++){
      if((pas+pas2)%2==0 && ((tableau[i][j].className=='PionNoir' || tableau[i][j].className=='DameNoir') && parseInt(tourJeu)==0) || ((tableau[i][j].className=='PionBlanc' || tableau[i][j].className=='DameBlanc') && parseInt(tourJeu)==1)){ // Case Impaire (la ou doivent etre les pions)
        ChoixDispo2(i, j); // On calcul combien de pions peuvent manger
        
        if(nbEat!=0 && x==0 && aMange==0){
          nbEat2++; // On retient combien de pion peuvent manger
          grille[i][j] = 1;
        }
        else if(aMange==1){
          grille[i][j] = 0;
          if(i==currentRow && j==currentColumn && nbEat!=0){
            nbEat2++;
            console.log("Pion en [" + i + "][" + j + "] peut manger");
            grille[i][j] = 1;
          }
        }
        else if(x!=0){
          grille[i][j] = 0;
          nbEat2 = 0;
          nbEat = 0;
        }
      }
    }
  }
}

mouse.addEventListener('mouseover', SurvolPionOn);
mouse.addEventListener('mouseout', SurvolPionOff);
mouse.addEventListener('click', ClickPion);

client.emit('QuelTour', pseudoTest);

client.on('NumTour', function(numJ) {
  tourDeJeu = numJ;
  if(tourDeJeu==1) console.log("Vous etes les blancs !");
  else console.log("Vous etes les noirs !");
});

client.on('RetMajCurrent', function(coord) {
  currentRow = coord.row;
  currentColumn = coord.column;
  console.log("row = " + currentRow + " |  col = " + currentColumn);
});

client.on('RetMajDepl', function(coord) {
  DeplacePion(coord.row, coord.column);
});

client.on('RetMajMange', function(coord) {
  MangePion(coord.row1, coord.column1, coord.row2, coord.column2);
});

client.on('RetMajTour', function(bin) {
  nbEat2 = 0;
  ChangeTour();
  console.log("tj = " + tourJeu + "  |  tDj = " + tourDeJeu);
});

client.on('RetMajStop', function(bin) {
  StopJeu();
});

client.on('RetAbandon', function(bin) {
  alert("Bien joué ! Tu as fait ragequit ton adversaire");
  document.location.href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&autoplaytrue";
});