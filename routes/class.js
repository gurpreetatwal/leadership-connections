'use strict';

const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
  await next();
  ctx.response.body = 'hello world';
});

module.exports = router;
