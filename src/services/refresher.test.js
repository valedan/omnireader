import { setupTests } from '../../testHelper';
import { fetchStory } from './scraper';
import { refreshStory } from './refresher';
import { generateStory } from '../../__tests__/factories/story';
import { generateChapter } from '../../__tests__/factories/chapter';
import { Story } from '../models/story';
import { Chapter } from '../models/chapter';

setupTests({ database: true });
jest.mock('./scraper');

const story = generateStory();
const chapter1 = generateChapter();
const chapter2 = generateChapter();
const newChapter = generateChapter();

const setupSavedStory = async () => {
  const savedStory = await Story.query().insert(story);
  await savedStory.$relatedQuery('chapters').insert([chapter1, chapter2]);
  // await savedStory.$query().patch({ updated_at: new Date() - 60 * 1000 }); // 1 minute ago
  return savedStory;
};

describe('.refreshStory', () => {
  it('fetches the story', async () => {
    const savedStory = await setupSavedStory();
    fetchStory.mockImplementationOnce(() => {
      return { ...story, chapters: [chapter1, chapter2] };
    });
    refreshStory(savedStory);
    expect(fetchStory).toHaveBeenCalledWith(story.canonicalUrl);
  });

  // context('description or title or information has changed', () => {
  //   it('updates story');
  // });

  context('when there are no new chapters', () => {
    it('does nothing', async () => {
      const savedStory = await setupSavedStory();

      fetchStory.mockImplementationOnce(() => {
        return { ...story, chapters: [chapter1, chapter2] };
      });
      refreshStory(savedStory);
      const chapterCount = await Chapter.query().count();
      expect(chapterCount[0].count).toStrictEqual('2');
    });
  });

  context('when there are new chapters', () => {
    it('adds new chapter to the database', async () => {
      const savedStory = await setupSavedStory();
      fetchStory.mockImplementationOnce(() => {
        return { ...story, chapters: [chapter1, chapter2, newChapter] };
      });
      refreshStory(savedStory);
      const storiesWithChapters = await Story.query().eager('chapters');
      const chapters = storiesWithChapters[0].chapters;
      expect(chapters).toHaveLength(3);
      expect(chapters[0].title).toStrictEqual(newChapter.title);
      fetchStory.mockReset();
    });

    it('touches the story', async () => {
      const savedStory = await setupSavedStory();
      fetchStory.mockImplementationOnce(() => {
        return { ...story, chapters: [chapter1, chapter2, newChapter] };
      });
      refreshStory(savedStory);
      const times = await Story.query().select('updated_at');
      const storyUpdated = times[0].updated_at;

      expect(storyUpdated.getTime()).toBeGreaterThan(new Date() - 1000); // 1 second ago
      fetchStory.mockReset();
    });
  });
});
