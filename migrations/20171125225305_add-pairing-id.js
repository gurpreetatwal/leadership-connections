'use strict';

async function up(knex) {
  await knex.schema.table('pairing', function (table) {
    table.dropPrimary();
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.unique(['class', 'student_1', 'student_2']);
  });

}

async function down(knex) {
  await knex.schema.table('pairing', function (table) {
    table.dropPrimary();
    table.dropUnique(['class', 'student_1', 'student_2']);
    table.dropColumn('id');
    table.primary(['class', 'student_1', 'student_2']);
  });
}

module.exports = {up, down};
