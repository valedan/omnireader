import nock from 'nock';
import { setupDatabase, setupApi, readFixture } from '#/helpers';
import { Story } from '/models/story';
import { generateStory } from '#/factories/story';
import { generatePost } from '#/factories/post';

jest.mock('/services/refresher');

setupDatabase();
setupApi();

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
      const res = await query({ query: GET_STORIES });
      expect(res.data.stories).toHaveLength(0);
    });
  });

  context('When there are stories', () => {
    it('returns all stories with associated posts', async () => {
      const storyWithPosts = generateStory();
      const storyWithoutPosts = generateStory();
      const posts = [generatePost(), generatePost()];
      const savedStory = await Story.query().insert(storyWithPosts);
      await Story.query().insert(storyWithoutPosts);
      await savedStory.$relatedQuery('posts').insert(posts);
      const res = await query({ query: GET_STORIES });
      expect(res.data.stories).toHaveLength(2);
      expect(res.data.stories[0].posts).toHaveLength(2);
      expect(res.data.stories[0].posts[0].title).toStrictEqual(posts[0].title);
    });
  });
});

describe('Mutation: deleteStory', () => {
  // TODO
});
