import { setupTests } from '../../testHelper';
import { Story } from '../../src/models/story';
import { Chapter } from '../../src/models/chapter';
import { generateStory } from '../factories/story';
import { generateChapter } from '../factories/chapter';
import fs from 'fs';
import nock from 'nock';

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
      expect(res.data.stories.length).toEqual(0);
    });
  });

  context('When there are stories', () => {
    const storyWithChapters = generateStory();
    const storyWithoutChapters = generateStory();
    const chapters = [generateChapter(), generateChapter()];

    beforeEach(async () => {
      const savedStory = await Story.query().insert(storyWithChapters);
      await Story.query().insert(storyWithoutChapters);
      await savedStory.$relatedQuery('chapters').insert(chapters);
    });

    it('returns all stories with associated chapters', async () => {
      const res = await query({ query: GET_STORIES });
      expect(res.data.stories.length).toEqual(2);
      expect(res.data.stories[0].chapters.length).toEqual(2);
      expect(res.data.stories[0].chapters[0].title).toEqual(chapters[0].title);
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
    let existingStory;
    let res;
    beforeEach(async () => {
      existingStory = await Story.query().insert(
        generateStory({ canonicalUrl: storyUrl }),
      );
      res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
    });

    it("returns an error including the existing story's id", async () => {
      const error = res.errors[0];
      expect(error.extensions.exception.story.id).toEqual(existingStory.id);
      expect(error.extensions.code).toEqual('BAD_USER_INPUT');
      expect(error.message).toEqual('Story already exists!');
    });
  });

  context('When a site is not supported', () => {
    it('returns an error', async () => {
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: 'http://foo.com' },
      });

      const error = res.errors[0];
      expect(error.extensions.code).toEqual('BAD_USER_INPUT');
      expect(error.message).toEqual('Site not supported!');
    });
  });

  context('When a story cannot be found at the target', () => {
    beforeEach(() => {
      const homepage = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../tests/fixtures/ffn_homepage.html`,
      );
      nock('https://www.fanfiction.net')
        .get('/s/13120599/1/')
        .reply(200, homepage);
    });

    it('returns an error', async () => {
      const res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
      const error = res.errors[0];
      expect(error.extensions.code).toEqual('BAD_USER_INPUT');
      expect(error.message).toEqual('Story not found!');
    });
  });

  context('When story is new and can be parsed', () => {
    let res;
    beforeEach(async () => {
      const hpmor = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../tests/fixtures/ffn_hpmor_chapter_1.html`,
      );
      nock('https://www.fanfiction.net')
        .get('/s/13120599/1/')
        .reply(200, hpmor);
      res = await mutate({
        mutation: CREATE_STORY,
        variables: { url: storyUrl },
      });
    });

    it('saves story to database', async () => {
      const story = await Story.query().findOne({});
      expect(story.title).toEqual(
        'Harry Potter and the Methods of Rationality',
      );
    });

    it('returns the story with chapter index', async () => {
      expect(res.data.createStory.title).toEqual(
        'Harry Potter and the Methods of Rationality',
      );
    });
  });
});
