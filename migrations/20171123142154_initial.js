'use strict';

async function up(knex) {

  await knex.schema.createTable('class', function(table) {
    table.uuid('id').primary();
    table.integer('weeks').notNullable();
    table.enu('semester', ['fall', 'spring', 'summer']).notNullable();
    table.integer('year').notNullable();
    table.timestamps();
  });

  await knex.schema.createTable('student', function (table) {
    table.uuid('id').primary();
    table.uuid('class').references('class.id').onDelete('restrict').notNullable();
    table.string('name').notNullable();
    table.text('image');
    table.timestamps();
  });

  await knex.schema.createTable('pairing', function (table) {
    table.uuid('class').references('class.id').onDelete('restrict').notNullable();
    table.integer('week').notNullable();
    table.uuid('student_1').references('student.id').onDelete('restrict');
    table.uuid('student_2').references('student.id').onDelete('restrict');
    table.text('image');
    table.timestamps();
    table.primary(['class', 'student_1', 'student_2']);
  });

}

async function down(knex) {
  await knex.schema.dropTable('pairing');
  await knex.schema.dropTable('student');
  await knex.schema.dropTable('class');
}

module.exports = {up, down};
