import { UserInputError } from 'apollo-server-express';
import { UnsupportedSiteError, NoStoryError } from '/errors';
import { scrape } from '/services/scraper';
import { refreshStory } from '/services/refresher';

export default {
  Query: {
    stories: async (_, __, { models }) => {
      const stories = await models.Story.query()
        .eager('posts')
        .modifyEager('posts', builder => {
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
        .eager('posts')
        .modifyEager('posts', builder => {
          builder.orderBy('id');
        });
    },

    post: async (_, { id }, { models }) => {
      const post = await models.Post.query()
        .findById(id)
        .eager('story');
      if (!post) throw new UserInputError('Post not found!');
      const { content } = await scrape({ url: post.url, getStory: false });
      const nextPost = await models.Post.query().findOne({
        storyId: post.storyId,
        number: post.number + 1,
      });
      const prevPost = await models.Post.query().findOne({
        storyId: post.storyId,
        number: post.number - 1,
      });
      return {
        ...post,
        content,
        nextId: nextPost && nextPost.id,
        prevId: prevPost && prevPost.id,
      };
    },
  },

  Mutation: {
    updateProgress: async (_, { postId, progress }, { models }) => {
      if (progress < 0) throw new UserInputError('Invalid progress value!');

      const post = await models.Post.query()
        .patchAndFetchById(postId, {
          progress,
          progressUpdatedAt: new Date().toISOString(),
        })
        .throwIfNotFound();
      return post;
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
        const { posts, ...storyData } = await scrape({
          url,
          getStory: true,
        });

        const savedStory = await models.Story.query().insert(storyData);
        savedStory.details = JSON.stringify(savedStory.details);
        savedStory.posts = [];
        posts.map(async postData => {
          const savedPost = await savedStory
            .$relatedQuery('posts')
            .insert(postData);
          savedStory.posts.push(savedPost);
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
