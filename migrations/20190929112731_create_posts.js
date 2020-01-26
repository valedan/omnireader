exports.up = knex => {
  return knex.schema.createTable('posts', table => {
    table.increments('id').primary();
    table.timestamps(null, true);
    table.string('title').notNullable();
    table.string('url', 2000).notNullable();
    table.timestamp('progressUpdatedAt');
    // TODO: uniqueness constraint
    table
      .integer('number')
      .default(1)
      .notNullable()
      .unsigned();
    table
      .float('progress')
      .default(0)
      .notNullable()
      .unsigned();
    table
      .integer('storyId')
      .unsigned()
      .references('id')
      .inTable('stories')
      .onDelete('cascade')
      .index();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('posts');
};
