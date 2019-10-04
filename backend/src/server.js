import { ApolloServer } from 'apollo-server';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';
import Knex from 'knex';
import knexConfig from '../knexfile';
import { Model } from 'objection';
import { Story } from './models/story';
import { Chapter } from './models/chapter';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    models: { Story, Chapter },
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

export default server;
