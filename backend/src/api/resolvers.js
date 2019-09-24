import { createStory } from '../services/scraper';

export default {
  Query: {
    stories: (_, __, { models }) => models.Story.allWithChapters(),
    chapter: async (_, { id }, { models }) =>
      await models.Chapter.chapterWithContent(id),
  },
  Mutation: {
    createStory: async (_, { url }, { models }) => {
      const story = await createStory(url);
      return story;
    },
  },
};
