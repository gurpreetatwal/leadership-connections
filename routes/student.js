'use strict';

const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new Router();

router.get('/', async (ctx, next) => {
  await next();
  // TODO this should fetch from a database
  ctx.response.type = 'application/json';
  ctx.response.body = fs.createReadStream(path.join(__dirname, '..', 'students.json'));
});

module.exports = router;
