'use strict';

const _ = require('lodash');
const Router = require('koa-router');
const parser = require('koa-body');

const knex = require('../lib/knex');

const router = new Router();

const form = parser({json: false, urlencoded: false, multipart: true});

router.get('/', async (ctx, next) => {
  await next();
  const students = await knex('student').select();
  students.forEach(s => s.name = _.startCase(s.name));
  ctx.response.type = 'application/json';
  ctx.response.body = students;
});

router.post('/', form, async (ctx, next) => {
  await next();

  const student = ctx.request.body;
  ctx.assert(student.name, 400, 'Each student must have a name');
  ctx.assert(student.image, 400, 'Each student must have an image');
  student.name = student.name.toLowerCase();

  // TODO allow for adding students from UI
});

module.exports = router;
