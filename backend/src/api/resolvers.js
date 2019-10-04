import { createStory, getChapterContent } from '../services/scraper';

export default {
  Query: {
    stories: async (_, __, { models }) =>
      await models.Story.query().eager('chapters'),

    chapter: async (_, { id }, { models }) => {
      const chapter = await models.Chapter.query()
        .findById(id)
        .eager('story');
      return { ...chapter, content: await getChapterContent(chapter) };
    },
  },

  Mutation: {
    createStory: async (_, { url }, {}) => await createStory(url),
  },
};
