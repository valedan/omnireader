import { setupTests } from '../../testHelper';
import { fetchStory } from './scraper';
import { refreshStory } from './refresher';
import { generateStory } from '../../tests/factories/story';
import { generateChapter } from '../../tests/factories/chapter';

setupTests({ database: true });
jest.mock('fetchStory');

const story = generateStory();
const chapter1 = generateChapter();
const chapter2 = generateChapter();
const newChapter = generateChapter();

beforeEach(async () => {
  const savedStory = await Story.query().insert(story);
  await savedStory.$relatedQuery('chapters').insert([chapter1, chapter2]);
  savedStory.patch({ updated_at: new Date() - 60 * 1000 }); // 1 minute ago
});

describe('.refreshStory', () => {
  it('fetches the story', async () => {
    refreshStory(savedStory);
    expect(fetchStory).toBeCalledWith(story.canonicalUrl);
  });

  context('description or title or information has changed', () => {
    it('updates story');
  });

  context('when there are no new chapters', () => {
    it('does nothing', async () => {
      fetchStory.mockImplementationOnce(() => {
        return { ...story, chapters: [chapter1, chapter2] };
      });
      refreshStory(savedStory);
      expect(Chapter.query().count()).toEqual(2);
    });
  });

  context('when there are new chapters', () => {
    beforeEach(async () => {
      fetchStory.mockImplementationOnce(() => {
        return { ...story, chapters: [chapter1, chapter2, newChapter] };
      });
      refreshStory(savedStory);
    });

    it('adds new chapter to the database', async () => {
      const chapters = await models.Story.query().eager('chapters');
      expect(chapters.length).toEqual(3);
      expect(chapters[2].title).toEqual(newChapter.title);
    });

    it('touches the story', async () => {
      expect(savedStory.updated_at).toBeGreaterThan(new Date() - 1000); // 1 second ago
    });
  });
});
