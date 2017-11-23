'use strict';

const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const config = require('./config');

require('./lib/db');
const app = new Koa();
const router = new Router();

router.get('/students', async (ctx, next) => {
  await next();
  // TODO this should fetch from a database
  ctx.response.type = 'application/json';
  ctx.response.body = fs.createReadStream(path.join(__dirname, 'students.json'));
});

app.use(serve(path.join(__dirname, 'static')));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.get('port'));
