class User {
  constructor (idUser, pseudo, socket) {
    this.idUser = idUser;
    this.pseudo = pseudo;
    this.socket = socket;
    this.adversaire = '';
    this.tourJeu = 0;
    //this.ratio = ratio;
  }
  
  toJSON() {
    return {
        idUser: this.idUser,
        pseudo: this.pseudo,
    }
  }
}

module.exports = User;