'use strict';

const path = require('path');
const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'production',
    env: 'NODE_ENV',
    arg: 'node-env',
  },
  port: {
    doc: 'The port for the http server to listen on.',
    format: 'port',
    default: -1,
    env: 'PORT',
    arg: 'port',
  },
  host: {
    doc: 'URL pointing to the hosted code, used as base for static assets',
    format: 'url',
    default: '',
    env: 'HOST',
  },
  database: {
    host: {
      doc: 'hostname for the database server',
      format: String,
      default: null,
      env: 'DB_HOST',
    },
    port: {
      doc: 'port for the database server',
      format: 'port',
      default: 5432,
      env: 'DB_PORT',
    },
    user: {
      doc: 'user to connect to database server as',
      format: String,
      default: 'postgres',
      env: 'DB_USER',
    },
    password: {
      doc: 'password for the database user',
      format: String,
      default: null,
      env: 'DB_PASSWORD',
    },
    database: {
      doc: 'name of the database to use on the database server',
      format: String,
      default: null,
      env: 'DB_DATABASE',
    },
  },
  facebook: {
    token: {
      doc: 'a long lived facebook page access token, see readme',
      format: String,
      default: null,
      env: 'FB_TOKEN',
    },
  },
});

const configFile = `${config.get('env')}.json`;

config.loadFile(path.resolve(__dirname, configFile));

try {
  config.loadFile(path.resolve(__dirname, 'secret', configFile));
} catch (e) {
  // ignore no such file errors, secrets might be passed via env args
  if (e.code !== 'ENOENT') throw e;
}

config.validate({ allowed: 'strict' });

module.exports = config;
