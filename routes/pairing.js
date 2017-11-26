'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const Router = require('koa-router');
const moment = require('moment');
const parser = require('koa-body');

const config = require('../config');
const knex = require('../lib/knex');
const upload = require('../lib/upload');

const router = new Router();
const url = parser({urlencoded: true, multipart: false, json: false});
const form = parser({json: false, urlencoded: false, multipart: true});

// TODO these should not be hardcoded, but should be part of class data
const start = moment('2017-08-24');
const weeks = 15;
const classId = 'd0257fa9-ebb3-4c25-b880-e13740b2334c';

async function attachStudents(pairings) {
  return Promise.map(pairings, async function(pair) {

    const [[student_1], [student_2]] = await Promise.join(
      knex.select().from('student').where('id', pair.student_1),
      knex.select().from('student').where('id', pair.student_2)
    );

    student_1.name = _.startCase(student_1.name);
    student_2.name = _.startCase(student_2.name);

    pair.student_1 = student_1;
    pair.student_2 = student_2;
    return pair;

  });
}

router.post('/:id', form, async (ctx, next) => {

  const image = _.get(ctx, 'request.body.files.image');
  ctx.assert(image, 400, 'Each student must have an image');

  ctx.file = image;

  await next();

  ctx.body = await knex('pairing')
    .update({
      image: `${config.get('host')}/images/${ctx.filename}`,
    })
    .returning(['id', 'image'])
    .where({
      id: ctx.params.id,
    });

  ctx.body = ctx.body[0];

}, upload);


router.get('/', url, async (ctx, next) => {

  const name = _.get(ctx, 'request.query.name');
  ctx.assert(name, 400, 'must pass student name');

  await next();

  const [student] = await knex.select()
    .from('student')
    .where('name', name.toLowerCase());

  // 404 if there is no matching student
  if (!student) return;

  const required = Math.min(
    moment().weeks() - moment(start).weeks(),
    weeks,
  );

  let pairings = await knex.select()
    .from('pairing')
    .where('class', classId)
    .where(function() {
      this.where('student_1', student.id)
        .orWhere('student_2', student.id);
    });

  if (pairings.length === required) {
    return ctx.body = _.sortBy(await attachStudents(pairings), 'week');
  }

  const done = _.map(pairings, 'week');

  for (let week = 0; week <= required; week++) {
    if (done.includes(week)) continue;
    // TODO use knex for this
    const result = await knex.raw(`
      select b.id
      from student a
      inner join student b on a.id != b.id
      where a.id = '${student.id}'
      and not exists (
        select student_2
        from pairing
        where ((student_1 = b.id OR student_2 = b.id) AND week = ${week})
          or (
            student_1 in (a.id, b.id) AND student_2 in (a.id, b.id)
          )
      )
      order by random()
      limit 1;
     `);

    const pairing = {
      class: classId,
      week,
      student_1: student.id,
      student_2: result.rows[0].id,
      image: null,
    };

    await knex('pairing').insert(pairing);
    pairings.push(pairing);
  }

  ctx.body = await attachStudents(pairings);
  ctx.body = _.sortBy(ctx.body, 'week');

});

module.exports = router;
