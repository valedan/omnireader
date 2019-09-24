import { ApolloServer } from 'apollo-server';
import typeDefs from './api/schema';
import { Story } from './models/story';
import { Chapter } from './models/chapter';
import resolvers from './api/resolvers';

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
