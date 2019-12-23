import { ApolloServer } from 'apollo-server-express';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';
import Knex from 'knex';
import knexConfig from '../knexfile';
import { Model } from 'objection';
import { Story } from './models/story';
import { Chapter } from './models/chapter';
import express from 'express';
import path from 'path';
import query from 'qs-middleware';

const knex =
  process.env.NODE_ENV === 'production'
    ? Knex(knexConfig.production)
    : Knex(knexConfig.development);

Model.knex(knex);

const app = express();

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}
app.use(express.static(path.join(__dirname, '../webapp/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../webapp/build', 'index.html'));
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: {
    rewriteError(err) {
      console.log(err);
      return err;
    },
  },
  context: ({ req }) => ({
    models: { Story, Chapter },
  }),
});
const apiPath = '/graphql';
app.use(query());

server.applyMiddleware({ app, apiPath });

app.listen({ port: port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
});

export default server;
