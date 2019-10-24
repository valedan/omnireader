import { setupTests } from '../../testHelper';
import { Story } from '../../src/models/story';
import { Chapter } from '../../src/models/chapter';
import { generateStory } from '../factories/story';
import { generateChapter } from '../factories/chapter';
import fs from 'fs';
import nock from 'nock';

setupTests({ database: true, api: { models: { Story, Chapter } } });

describe('Query: chapter', () => {
  const GET_CHAPTER = gql`
    query getChapter($id: ID!) {
      chapter(id: $id) {
        title
        content
      }
    }
  `;

  context('When chapter does not exist', () => {
    it('returns a not found error', async () => {
      const res = await query({
        query: GET_CHAPTER,
        variables: { id: 10 },
      });

      const error = res.errors[0];
      expect(error.extensions.code).toEqual('BAD_USER_INPUT');
      expect(error.message).toEqual('Chapter not found!');
    });
  });

  context('When chapter exists', () => {
    const chapterUrl = 'https://www.fanfiction.net/s/13120599/1/';
    const story = generateStory();
    const chapter = generateChapter({ url: chapterUrl });
    let savedChapter;

    beforeEach(async () => {
      const savedStory = await Story.query().insert(story);
      savedChapter = await savedStory
        .$relatedQuery('chapters')
        .insert([chapter]);
      savedChapter = savedChapter[0];
    });

    context('When chapter cannot be retrieved', () => {
      it('returns a server error', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(500);

        const res = await query({
          query: GET_CHAPTER,
          variables: { id: savedChapter.id },
        });

        const error = res.errors[0];
        expect(error.extensions.code).toEqual('INTERNAL_SERVER_ERROR');
        // TODO: I don't want to leak internal errors through the api like this. Need to figure out how to provide error messages for server errors.
        expect(error.message).toEqual('Request failed with status code 500');
      });
    });

    context('When chapter can be retrieved', () => {
      const hpmor = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../tests/fixtures/ffn_hpmor_chapter_1.html`,
      );

      it('returns chapter content', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(200, hpmor);

        const res = await query({
          query: GET_CHAPTER,
          variables: { id: savedChapter.id },
        });

        expect(res.data.chapter.title).toEqual(savedChapter.title);
        expect(res.data.chapter.content).toMatch(/Chapter Content/);
      });
    });
  });
});
