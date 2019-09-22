module.exports = {
  Query: {
    stories: (_, __, { dataSources }) => dataSources.storyAPI.getAllStories(),
    chapter: (_, { id }, { dataSources }) =>
      dataSources.chapterAPI.getChapterWithContent(id),
  },
  Mutation: {
    createStory: async (_, { url }, { dataSources }) => {
      const story = await dataSources.storyAPI.createStory(url);
      return story;
    },
  },
};
