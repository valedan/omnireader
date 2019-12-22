import { ApolloServer } from 'apollo-server';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';
import Knex from 'knex';
import knexConfig from '../knexfile';
import { Model } from 'objection';
import { Story } from './models/story';
import { Chapter } from './models/chapter';
import express from 'express';
import path from 'path';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    models: { Story, Chapter },
  }),
});
server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const app = express();

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}
app.use(express.static(path.join(__dirname, '../webapp/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../webapp/build', 'index.html'));
});
app.listen(port);

export default server;
