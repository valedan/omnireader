import nock from 'nock';
import { setupDatabase, setupApi, readFixture } from '#/helpers';
import { Story } from '/models/story';
import { Chapter } from '/models/chapter';
import { generateStory } from '#/factories/story';
import { generateChapter } from '#/factories/chapter';

setupDatabase();
setupApi();

const chapterUrl = 'https://www.fanfiction.net/s/13120599/1/';
const story = generateStory();
const chapter = generateChapter({ url: chapterUrl });

const setupSavedChapter = async () => {
  const savedStory = await Story.query().insert(story);
  const [savedChapter] = await savedStory
    .$relatedQuery('chapters')
    .insert([chapter]);
  return savedChapter;
};

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
      expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toStrictEqual('Chapter not found!');
    });
  });

  context('When chapter exists', () => {
    context('When chapter cannot be retrieved', () => {
      it('returns a server error', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(500);

        const savedChapter = await setupSavedChapter();
        const res = await query({
          query: GET_CHAPTER,
          variables: { id: savedChapter.id },
        });

        const error = res.errors[0];
        expect(error.extensions.code).toStrictEqual('INTERNAL_SERVER_ERROR');
        // TODO: I don't want to leak internal errors through the api like this. Need to figure out how to provide error messages for server errors.
        expect(error.message).toStrictEqual(
          'Request failed with status code 500',
        );
      });
    });

    context('When chapter can be retrieved', () => {
      const hpmor = readFixture('ffn_hpmor_chapter_1.html');

      it('returns chapter content', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(200, hpmor);
        const savedChapter = await setupSavedChapter();

        const res = await query({
          query: GET_CHAPTER,
          variables: { id: savedChapter.id },
        });

        expect(res.data.chapter.title).toStrictEqual(savedChapter.title);
        expect(res.data.chapter.content).toMatch(/Chapter Content/);
      });
    });
  });
});

describe('Mutation: updateProgress', () => {
  const UPDATE_PROGRESS = gql`
    mutation updateProgress($chapterId: ID!, $progress: Float!) {
      updateProgress(chapterId: $chapterId, progress: $progress) {
        id
        progress
      }
    }
  `;
  context('When chapter does not exist', () => {
    it('returns a not found error', async () => {
      const res = await mutate({
        mutation: UPDATE_PROGRESS,
        variables: { chapterId: 1000, progress: 0 },
      });
      expect(res.errors[0].message).toStrictEqual('NotFoundError');
    });
  });

  context('When chapter exists', () => {
    context('When given an invalid progress', () => {
      it('returns a user input error', async () => {
        const savedChapter = await setupSavedChapter();

        const res = await mutate({
          mutation: UPDATE_PROGRESS,
          variables: { chapterId: savedChapter.id, progress: -1 },
        });
        const error = res.errors[0];
        expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      });
    });

    context('When given a valid progress', () => {
      it('updates progress and timestamp', async () => {
        const savedChapter = await setupSavedChapter();

        const res = await mutate({
          mutation: UPDATE_PROGRESS,
          variables: { chapterId: savedChapter.id, progress: 0.45 },
        });
        const updatedChapter = await Chapter.query().findById(savedChapter.id);
        expect(res.errors).toBeUndefined(undefined);
        expect(updatedChapter.progress).toStrictEqual(0.45);
        expect(updatedChapter.progressUpdatedAt.toDateString()).toStrictEqual(
          new Date().toDateString(),
        );
      });
    });
  });
});
