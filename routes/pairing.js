'use strict';

const _ = require('lodash');
const Router = require('koa-router');
const parser = require('koa-body');

const knex = require('../lib/knex');

const router = new Router();

const url = {urlencoded: true, multipart: false, json: false};

router.get('/', parser(url), async (ctx, next) => {

  const name = _.get(ctx, 'request.query.name');
  ctx.assert(name, 400, 'must pass student name');

  await next();

  const [student] = await knex.select()
    .from('student')
    .where('name', name.toLowerCase());

  // 404 if there is no matching student
  if (!student) return;

  // TODO get the matching pairings
  ctx.response.body = student;
});

module.exports = router;
