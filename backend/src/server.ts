// import errorHandler from 'errorhandler';

// import app from './app';

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./api/schema');
const StoryAPI = require('./api/datasources/story');
const ChapterAPI = require('./api/datasources/chapter');
const resolvers = require('./api/resolvers');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    storyAPI: new StoryAPI(),
    chapterAPI: new ChapterAPI(),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
/**
 * Error Handler. Provides full stack - remove for production
 */
// app.use(errorHandler());

/**
 * Start Express server.
 */
// const server = app.listen(app.get('port'), () => {
//   console.log(
//     '  App is running at http://localhost:%d in %s mode',
//     app.get('port'),
//     app.get('env'),
//   );
//   console.log('  Press CTRL-C to stop\n');
// });

export default server;
