'use strict';

const knex = require('knex');

const config = require('../config');


module.exports = knex({
  client: 'pg',
  debug: true,
  connection: {
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.database'),
  }
});
