exports.up = knex => {
  return knex.schema.createTable('stories', table => {
    table.increments('id').primary();
    table.timestamps(null, true);
    table.string('canonicalUrl', 2000).notNullable();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('avatar');
    table.json('details');
    table.timestamp('tocLastChecked');
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('stories');
};
