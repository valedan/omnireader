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

    posts: async (_, { storyId }, { models }) => {
      if (storyId === undefined) {
        storyId = null;
      }
      const posts = await models.Post.query().where({ storyId });
      return posts;
    },

    post: async (_, { id }, { models }) => {
      const post = await models.Post.query()
        .findById(id)
        .eager('story');
      if (!post) throw new UserInputError('Post not found!');
      const { content } = await scrape({ url: post.url, getStory: false });
      if (!content) throw new Error('Unable to retrieve post!');
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

    deletePost: async (_, { id }, { models }) => {
      const post = await models.Post.query().findById(id);
      if (post.storyId) {
        throw new UserInputError('Cannot delete a post belonging to a story!');
      } else {
        await models.Story.query().deleteById(id);
        return true;
      }
    },

    createPost: async (_, { url }, { models }) => {
      const existingPost = await models.Post.query().findOne({ url });
      if (existingPost) {
        throw new UserInputError('Post is already in your library!', {
          post: { id: existingPost.id },
        });
      }

      const { content, ...scraperData } = await scrape({ url, getStory: true });
      if (!Object.keys(scraperData).length) {
        throw new Error('Could not parse site!');
      } else if (scraperData.posts) {
        // the scraper gave us a whole story
        const savedStory = await models.Story.query().insert(scraperData);
        savedStory.details = JSON.stringify(savedStory.details);
        savedStory.posts = [];
        scraperData.posts.map(async postData => {
          const savedPost = await savedStory
            .$relatedQuery('posts')
            .insert(postData);
          savedStory.posts.push(savedPost);
        });
        return { ...scraperData, story: savedStory };
      } else {
        // this is a standalone post
        const savedPost = await models.Post.query().insert(scraperData);
        return { content, ...savedPost };
      }
    },
  },
};
