'use strict';

const students = require('./students');
const classId = 'd0257fa9-ebb3-4c25-b880-e13740b2334c';

async function seed(knex) {

  await knex('student').del();
  await knex('class').del();

  await knex('class').insert({
    id: classId,
    weeks: 15,
    semester: 'fall',
    year: 2017,
    starts: '2017-08-24 00:00:00',
  });

  students.forEach(function(student) {
    student.class = classId;
    student.name = student.name.toLowerCase();
  });

  await knex('student').insert(students);
}

module.exports = {seed};
