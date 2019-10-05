import { fetchStory, fetchChapter } from '../services/scraper';

export default {
  Query: {
    stories: async (_, __, { models }) =>
      await models.Story.query().eager('chapters'),

    chapter: async (_, { id }, { models }) => {
      const chapter = await models.Chapter.query()
        .findById(id)
        .eager('story');
      const { content } = await fetchChapter(chapter.url);
      return { ...chapter, content: content };
    },
  },

  Mutation: {
    createStory: async (_, { url }, { models }) => {
      const { chapters, ...storyData } = await fetchStory(url);
      const savedStory = await models.Story.query().insert(storyData);
      savedStory.details = JSON.stringify(savedStory.details);
      savedStory.chapters = [];
      for (const chapterData of chapters) {
        const savedChapter = await savedStory
          .$relatedQuery('chapters')
          .insert(chapterData);
        savedStory.chapters.push(savedChapter);
      }
      return savedStory;
    },
  },
};
