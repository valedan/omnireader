import nock from 'nock';
import gql from 'graphql-tag';

import { setupDatabase, setupApi, readFixture } from '#/helpers';
import { Story } from '/models';
import { StoryFactory, PostFactory } from '#/factories/';

jest.mock('/services/refresher');

setupDatabase();
const server = setupApi();

describe('Query: stories', () => {
  const GET_STORIES = gql`
    query getStories {
      stories {
        title
        posts {
          title
        }
      }
    }
  `;

  context('When there are no stories', () => {
    it('returns empty results', async () => {
      const res = await server.query({ query: GET_STORIES });
      expect(res.data.stories).toHaveLength(0);
    });
  });

  context('When there are stories', () => {
    it('returns all stories with associated posts', async () => {
      const storyWithPosts = StoryFactory.build();
      const storyWithoutPosts = StoryFactory.build();
      const posts = [PostFactory.build(), PostFactory.build()];
      const savedStory = await Story.query().insert(storyWithPosts);
      await Story.query().insert(storyWithoutPosts);
      await savedStory.$relatedQuery('posts').insert(posts);
      const res = await server.query({ query: GET_STORIES });
      expect(res.data.stories).toHaveLength(2);
      expect(res.data.stories[0].posts).toHaveLength(2);
      expect(res.data.stories[0].posts[0].title).toStrictEqual(posts[0].title);
    });
  });
});

describe('Mutation: deleteStory', () => {
  // TODO
});
