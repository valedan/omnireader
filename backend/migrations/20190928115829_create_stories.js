exports.up = knex => {
  return knex.schema.createTable('stories', table => {
    table.increments('id').primary();
    table.timestamps();
    table.string('canonicalUrl', 2000).notNullable();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('avatar');
    table.json('details');
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('stories');
};
