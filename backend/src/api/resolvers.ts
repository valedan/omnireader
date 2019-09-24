import { createStory } from '../services/scraper';

export default {
  Query: {
    stories: (_: any, __: any, { models }) => models.Story.allWithChapters(),
    chapter: async (_: any, { id }, { models }) =>
      await models.Chapter.chapterWithContent(id),
  },
  Mutation: {
    createStory: async (_: any, { url }, { models }) => {
      const story = await createStory(url);
      return story;
    },
  },
};
