'use strict';

async function up(knex) {
  await knex.schema.table('pairing', function (table) {
    table.text('fb_image').nullable();
  });

}

async function down(knex) {
  await knex.schema.table('pairing', function (table) {
    table.dropColumn('fb_image');
  });
}

module.exports = {up, down};
