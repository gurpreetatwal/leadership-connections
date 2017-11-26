'use strict';

const _ = require('lodash');
const Router = require('koa-router');
const moment = require('moment');
const parser = require('koa-body');

const knex = require('../lib/knex');

const router = new Router();
const url = {urlencoded: true, multipart: false, json: false};

// TODO these should not be hardcoded, but should be part of class data
const start = moment('2017-08-24');
const weeks = 15;
const classId = 'd0257fa9-ebb3-4c25-b880-e13740b2334c';

async function attachStudents(pairings) {


  // TODO ew, this needs to be parallel
  for (let i = 0; i < pairings.length; i++) {
    const pair = pairings[i];
    pair.student_1 = (await knex.select().from('student').where('id', pair.student_1))[0];
    pair.student_2 = (await knex.select().from('student').where('id', pair.student_2))[0];
  }

  return pairings;

}

router.get('/', parser(url), async (ctx, next) => {

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
    })
    .orderBy('week', 'asc');

  if (pairings.length === required) {
    return ctx.response.body = await attachStudents(pairings);
  }

  for (let week = pairings.length + 1; week <= required; week++) {

    // TODO use knex for this
    const result = await knex.raw(`
      select b.id
      from student a
      inner join student b on a.id != b.id
      where a.id = '${student.id}'
      and not exists (
        select student_2
        from pairing
        where (student_1 = b.id OR student_2 = b.id AND week = 1)
          or (
            student_1 in (a.id, b.id) AND student_2 in (a.id, b.id)
          )
      )
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

  ctx.response.body = await attachStudents(pairings);

});

module.exports = router;
