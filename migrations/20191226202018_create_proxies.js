exports.up = knex => {
  return knex.schema.createTable('proxies', table => {
    table.increments('id').primary();
    table.timestamps(null, true);
    table.string('ip').notNullable();
    table
      .integer('port')
      .default(80)
      .notNullable();
    table.string('username').notNullable();
    table.string('password').notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('proxies');
};
