var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});

async function init () {
  await knex.raw(`DROP TABLE IF EXISTS users `) ;
  
  await knex.raw(`CREATE TABLE users (
   username VARCHAR(255) NOT NULL PRIMARY KEY,
   password VARCHAR(255) NOT NULL)`);
  
  await knex.raw(`INSERT INTO users VALUES ('val','lol')`);
  knex.destroy(); 
}

init();