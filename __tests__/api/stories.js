import fs from 'fs';
import nock from 'nock';
import { setupTests } from '../../testHelper';
import { Story } from '../../src/models/story';
import { Chapter } from '../../src/models/chapter';
import { generateStory } from '../factories/story';
import { generateChapter } from '../factories/chapter';

jest.mock('../../src/services/refresher');

setupTests({ database: true, api: { models: { Story, Chapter } } });

describe('Query: stories', () => {
  const GET_STORIES = gql`
    query getStories {
      stories {
        title
        chapters {
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
    it('returns all stories with associated chapters', async () => {
      const storyWithChapters = generateStory();
      const storyWithoutChapters = generateStory();
      const chapters = [generateChapter(), generateChapter()];
      const savedStory = await Story.query().insert(storyWithChapters);
      await Story.query().insert(storyWithoutChapters);
      await savedStory.$relatedQuery('chapters').insert(chapters);
      const res = await query({ query: GET_STORIES });
      expect(res.data.stories).toHaveLength(2);
      expect(res.data.stories[0].chapters).toHaveLength(2);
      expect(res.data.stories[0].chapters[0].title).toStrictEqual(
        chapters[0].title,
      );
    });
  });
});

describe('Mutation: createStory', () => {
  const storyUrl = 'https://www.fanfiction.net/s/13120599/1/';

  const CREATE_STORY = gql`
    mutation createStory($url: String!) {
      createStory(url: $url) {
        title
        chapters {
          title
        }
      }
    }
  `;

  context('When a story exists with the same canonicalUrl', () => {
    it("returns an error including the existing story's id", async () => {
      const existingStory = await Story.query().insert(
        generateStory({ canonicalUrl: storyUrl }),
      );
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
      const error = res.errors[0];
      expect(error.extensions.exception.story.id).toStrictEqual(
        existingStory.id,
      );
      expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toStrictEqual('Story already exists!');
    });
  });

  context('When a site is not supported', () => {
    it('returns an error', async () => {
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: 'http://foo.com' },
      });

      const error = res.errors[0];
      expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toStrictEqual('Site not supported!');
    });
  });

  context('When a story cannot be found at the target', () => {
    it('returns an error', async () => {
      const homepage = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../__tests__/fixtures/ffn_homepage.html`,
      );
      nock('https://www.fanfiction.net')
        .get('/s/13120599/1/')
        .reply(200, homepage);
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
      const error = res.errors[0];
      expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toStrictEqual('Story not found!');
    });
  });

  context('When story is new and can be parsed', () => {
    it('saves story to database and returns story with chapter index', async () => {
      const hpmor = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../__tests__/fixtures/ffn_hpmor_chapter_1.html`,
      );
      nock('https://www.fanfiction.net')
        .get('/s/13120599/1/')
        .reply(200, hpmor);
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
      const story = await Story.query().findOne({});
      expect(story.title).toStrictEqual(
        'Harry Potter and the Methods of Rationality',
      );
      expect(res.data.createStory.title).toStrictEqual(
        'Harry Potter and the Methods of Rationality',
      );
    });
  });
});

describe('Mutation: deleteStory', () => {
  // TODO
});
