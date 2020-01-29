import { ApolloServer } from 'apollo-server-express';
import query from 'qs-middleware';
import express from 'express';
import path from 'path';
import typeDefs from './api/schema';
import resolvers from './api/resolvers';
import Knex from 'knex';
import knexConfig from '/knexfile';
import { Model } from 'objection';
import { Story } from '/models/story';
import { Post } from '/models/post';
import { HttpProxy } from '/models/http_proxy';

const knex =
  process.env.NODE_ENV === 'production'
    ? Knex(knexConfig.production)
    : Knex(knexConfig.development);

Model.knex(knex);

const app = express();

let port = process.env.PORT;
if (port == null || port === '') {
  port = 3000;
}
// app.use(express.static(path.join(__dirname, '../webapp/build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../webapp/build', 'index.html'));
// });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  debug: true,
  engine: {
    rewriteError(err) {
      console.log(err);
      return err;
    },
  },
  context: () => ({
    models: { Story, Post, HttpProxy },
  }),
});
const apiPath = '/graphql';
app.use(query());

server.applyMiddleware({ app, apiPath });

app.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,
  );
});

export default server;
