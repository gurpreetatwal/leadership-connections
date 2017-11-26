'use strict';

const _ = require('lodash');
const Router = require('koa-router');
const fs = require('fs');
const uuid = require('uuid');
const parser = require('koa-body');
const path = require('path');

const config = require('../config');
const knex = require('../lib/knex');

const classId = 'd0257fa9-ebb3-4c25-b880-e13740b2334c';

const router = new Router();
const dir = path.join(__dirname, '..', 'static', 'images');

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

  let name = _.get(ctx, 'request.body.fields.name');
  const image = _.get(ctx, 'request.body.files.image');
  ctx.assert(name, 400, 'Each student must have a name');
  ctx.assert(image, 400, 'Each student must have an image');
  name = name.toLowerCase();

  const filename = uuid();
  const reader = fs.createReadStream(image.path);
  const stream = fs.createWriteStream(path.join(dir, filename));
  reader.pipe(stream);

  ctx.body = await knex('student').insert({
    name,
    class: classId,
    image: `${config.get('host')}/static/images/${filename}`,
  });

});

module.exports = router;
