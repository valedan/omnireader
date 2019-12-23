module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'dan',
      password: '',
      database: 'omnireader_dev',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'dan',
      password: '',
      database: 'omnireader_test',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
