import {
  fetchStory,
  fetchChapter,
  UnsupportedSiteError,
  NoStoryError,
} from '../services/scraper';
import { UserInputError } from 'apollo-server';

export default {
  Query: {
    stories: async (_, __, { models }) =>
      await models.Story.query()
        .eager('chapters')
        .modifyEager('chapters', builder => {
          builder.orderBy('id');
        }),

    chapter: async (_, { id }, { models }) => {
      const chapter = await models.Chapter.query()
        .findById(id)
        .eager('story');
      if (!chapter) throw new UserInputError('Chapter not found!');
      const { content } = await fetchChapter(chapter.url);
      return { ...chapter, content: content };
    },
  },

  Mutation: {
    updateProgress: async (_, { chapterId, progress }, { models }) => {
      if (progress < 0) throw new UserInputError('Invalid progress value!');

      const chapter = await models.Chapter.query()
        .patchAndFetchById(chapterId, {
          progress: progress,
          progressUpdatedAt: new Date().toISOString(),
        })
        .throwIfNotFound();
      return chapter;
    },

    createStory: async (_, { url }, { models }) => {
      const existingStory = await models.Story.query().findOne({
        canonicalUrl: url,
      });
      if (existingStory) {
        throw new UserInputError('Story already exists!', {
          story: { id: existingStory.id },
        });
      }
      try {
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
      } catch (err) {
        if (err instanceof UnsupportedSiteError) {
          throw new UserInputError('Site not supported!');
        }

        if (err instanceof NoStoryError) {
          throw new UserInputError('Story not found!');
        }

        throw err;
      }
    },
  },
};
