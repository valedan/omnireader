exports.up = knex => {
  return knex.schema.createTable('chapters', table => {
    table.increments('id').primary();
    table.timestamps();
    table.string('title');
    table.string('url', 2000);
    table
      .integer('number')
      .notNullable()
      .unsigned();
    table
      .integer('progress')
      .default(0)
      .notNullable()
      .unsigned();
    table
      .integer('storyId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('stories')
      .onDelete('cascade')
      .index();
  });
};

exports.down = knex => {
  return knex.schema.dropTableIfExists('chapters');
};
