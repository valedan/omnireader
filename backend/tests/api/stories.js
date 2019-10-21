import { setupTests } from '../../testHelper';
import { Story } from '../../src/models/story';
import { Chapter } from '../../src/models/chapter';
import { generateStory } from '../factories/story';
import { generateChapter } from '../factories/chapter';

setupTests({ database: true, api: { models: { Story, Chapter } } });

const GET_STORIES = gql`
  query GetStories {
    stories {
      title
      chapters {
        title
      }
    }
  }
`;

describe('Query: stories', () => {
  const storyWithChapters = generateStory();
  const storyWithoutChapters = generateStory();
  const chapters = [generateChapter(), generateChapter()];

  beforeEach(async () => {
    const savedStory = await Story.query(knex).insert(storyWithChapters);
    await Story.query(knex).insert(storyWithoutChapters);
    await savedStory.$relatedQuery('chapters').insert(chapters);
  });

  it('returns all stories with associated chapters', async () => {
    const res = await query({ query: GET_STORIES });
    expect(res.data.stories.length).toEqual(2);
    expect(res.data.stories[0].chapters.length).toEqual(2);
    expect(res.data.stories[0].chapters[0].title).toEqual(chapters[0].title);
  });
});
