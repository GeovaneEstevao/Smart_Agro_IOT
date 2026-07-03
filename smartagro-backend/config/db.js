const config = require('../knexfile.js');
const knex = require('knex')(config.development);

knex.raw('SELECT 1')
  .then(() => {
    console.log('SQLite connected');
  })
  .catch((e) => {
    console.error('SQLite not connected');
    console.error(e);
  });

module.exports = knex;