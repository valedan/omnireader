import Knex from 'knex';
import knexConfig from './knexfile';
import knexCleaner from 'knex-cleaner';
import gql from 'graphql-tag';
import { ApolloServer } from 'apollo-server';
import typeDefs from './src/api/schema';
import resolvers from './src/api/resolvers';
import { Model } from 'objection';

const { createTestClient } = require('apollo-server-testing');

export const setupTests = ({ database, api } = {}) => {
  global.context = describe;
  global.it = test;

  if (database === true) {
    const dbManager = require('knex-db-manager').databaseManagerFactory({
      knex: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          user: 'dan',
          password: '',
          database: 'omnireader_test',
        },
      },
      dbManager: {
        superUser: 'dan',
        superPassword: '',
      },
    });

    global.knex = Knex(knexConfig.test);
    Model.knex(knex);

    global.beforeAll(async () => {
      await dbManager.dropDb();
      await dbManager.createDb();
      await knex.migrate.latest();
    });

    global.beforeEach(async () => {
      await knexCleaner.clean(knex);
    });

    global.afterAll(async () => {
      knex.destroy();
      await dbManager.dropDb();
      dbManager.close();
    });
  }

  if (api) {
    global.server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ models: api.models }),
    });
    const { query } = createTestClient(server);
    global.query = query;
    global.gql = gql;
  }
};
