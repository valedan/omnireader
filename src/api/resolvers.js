import { UserInputError } from 'apollo-server-express';
import { UnsupportedSiteError, NoStoryError } from '/errors';
import { scrape } from '/services/scraper';
import { refreshStory } from '/services/refresher';

export default {
  Query: {
    stories: async (_, __, { models }) => {
      const stories = await models.Story.query()
        .eager('chapters')
        .modifyEager('chapters', builder => {
          builder.orderBy('id');
        });
      // TODO: This won't scale. Need to do this in a cron job.
      stories.map(async story => {
        await refreshStory(story);
      });
      return stories;
    },

    story: async (_, { id }, { models }) => {
      return models.Story.query()
        .findById(id)
        .eager('chapters')
        .modifyEager('chapters', builder => {
          builder.orderBy('id');
        });
    },

    chapter: async (_, { id }, { models }) => {
      const chapter = await models.Chapter.query()
        .findById(id)
        .eager('story');
      if (!chapter) throw new UserInputError('Chapter not found!');
      const { content } = await scrape({ url: chapter.url, getStory: false });
      const nextChapter = await models.Chapter.query().findOne({
        storyId: chapter.storyId,
        number: chapter.number + 1,
      });
      const prevChapter = await models.Chapter.query().findOne({
        storyId: chapter.storyId,
        number: chapter.number - 1,
      });
      return {
        ...chapter,
        content,
        nextId: nextChapter && nextChapter.id,
        prevId: prevChapter && prevChapter.id,
      };
    },
  },

  Mutation: {
    updateProgress: async (_, { chapterId, progress }, { models }) => {
      if (progress < 0) throw new UserInputError('Invalid progress value!');

      const chapter = await models.Chapter.query()
        .patchAndFetchById(chapterId, {
          progress,
          progressUpdatedAt: new Date().toISOString(),
        })
        .throwIfNotFound();
      return chapter;
    },

    tocChecked: async (_, { storyId }, { models }) => {
      await models.Story.query().patchAndFetchById(storyId, {
        tocLastChecked: new Date(),
      });
      return true;
    },

    deleteStory: async (_, { id }, { models }) => {
      await models.Story.query().deleteById(id);
      return true;
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
        const { chapters, ...storyData } = await scrape({
          url,
          getStory: true,
        });

        const savedStory = await models.Story.query().insert(storyData);
        savedStory.details = JSON.stringify(savedStory.details);
        savedStory.chapters = [];
        chapters.map(async chapterData => {
          const savedChapter = await savedStory
            .$relatedQuery('chapters')
            .insert(chapterData);
          savedStory.chapters.push(savedChapter);
        });
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
