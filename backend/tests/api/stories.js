import { setupTests } from '../../testHelper';
import { Story } from '../../src/models/story';
import { Chapter } from '../../src/models/chapter';
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
  beforeEach(async () => {
    const storyData = [
      {
        story: { title: 'Story1', canonicalUrl: 'Url1', author: 'Author1' },
        chapters: [
          { title: 'Chapter 1', url: 'Url1', number: 1 },
          { title: 'Chapter 2', url: 'Url2', number: 2 },
        ],
      },
      {
        story: { title: 'Story2', canonicalUrl: 'Url2', author: 'Author2' },
        chapters: [],
      },
    ];
    for (const { story, chapters } of storyData) {
      const savedStory = await Story.query(knex).insert(story);
      for (const chapter of chapters) {
        await savedStory.$relatedQuery('chapters').insert(chapter);
      }
    }
  });

  it('returns all stories with associated chapters', async () => {
    const res = await query({ query: GET_STORIES });
    expect(res.data.stories.length).toEqual(2);
    expect(res.data.stories[0].chapters.length).toEqual(2);
    expect(res.data.stories[0].chapters[0].title).toEqual('Chapter 1');
  });
});
