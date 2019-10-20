import {
  UnsupportedSiteError,
  NoStoryError,
  NoChapterError,
  fetchStory,
  fetchChapter,
} from './scraper';
import axios from 'axios';
import fs from 'fs';
import { setupTests } from '../../testHelper';
setupTests();

const expectedChapterData = {
  title: '1. A Day of Very Low Probability',
  number: 1,
  url:
    'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
  content: '<p>Chapter Content</p>',
};

const expectedStoryData = {
  canonicalUrl:
    'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
  title: 'Harry Potter and the Methods of Rationality',
  author: 'Less Wrong',
  details: {
    description:
      'Petunia married a biochemist, and Harry grew up reading science and science fiction. Then came the Hogwarts letter, and a world of intriguing new possibilities to exploit. And new friends, like Hermione Granger, and Professor McGonagall, and Professor Quirrell... COMPLETE.',
    information:
      'Rated: Fiction T - English - Drama/Humor - Harry P., Hermione G. - Chapters: 122 - Words: 661,619 - Reviews: 34,596 - Favs: 23,879 - Follows: 17,999 - Updated: 3/14/2015 - Published: 2/28/2010 - Status: Complete - id: 5782108',
  },
  chapters: [
    {
      title: '1. A Day of Very Low Probability',
      number: 1,
      url:
        'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
    },
    {
      title: '2. Everything I Believe Is False',
      number: 2,
      url:
        'https://www.fanfiction.net/s/5782108/2/Harry-Potter-and-the-Methods-of-Rationality',
    },
    {
      title: '3. Comparing Reality To Its Alternatives',
      number: 3,
      url:
        'https://www.fanfiction.net/s/5782108/3/Harry-Potter-and-the-Methods-of-Rationality',
    },
  ],
};

jest.mock('axios');

describe('.fetchStory', () => {
  context('When site is unsupported', () => {
    it('throws an error', () => {
      expect(fetchStory('https://badurl.com')).rejects.toThrow(
        UnsupportedSiteError,
      );
    });
  });

  context('When there is no story at provided url', () => {
    it('throws an error', async () => {
      const homepage = fs.readFileSync(
        // TODO: readFixture helper function
        `${__dirname}/../../tests/fixtures/ffn_homepage.html`,
      );
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: homepage,
        }),
      );
      await expect(
        fetchStory('https://www.fanfiction.net'),
      ).rejects.toThrowError(NoStoryError);
    });
  });

  it('returns the parsed story data', async () => {
    const hpmor = fs.readFileSync(
      `${__dirname}/../../tests/fixtures/ffn_hpmor_chapter_1.html`,
    );
    //TODO: mockResolved helper
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: hpmor,
      }),
    );
    const storyData = await fetchStory(
      'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
    );

    expect(storyData).toEqual(expectedStoryData);
  });
});

describe('.fetchChapter', () => {
  context('When the site is not supported', () => {
    it('throws an unsupported site error', () => {
      expect(fetchChapter('https://badurl.com')).rejects.toThrow(
        UnsupportedSiteError,
      );
    });
  });

  context('When there is no chapter at the url', () => {
    it('throws a no chapter error', async () => {
      const homepage = fs.readFileSync(
        `${__dirname}/../../tests/fixtures/ffn_homepage.html`,
      );
      axios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: homepage,
        }),
      );

      await expect(
        fetchChapter('https://www.fanfiction.net'),
      ).rejects.toThrowError(NoChapterError);
    });
  });

  it('returns the content of the chapter', async () => {
    const hpmor = fs.readFileSync(
      `${__dirname}/../../tests/fixtures/ffn_hpmor_chapter_1.html`,
    );
    //TODO: mockResolved helper
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data: hpmor,
      }),
    );
    const chapterData = await fetchChapter(
      'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
    );

    expect(chapterData).toEqual(expectedChapterData);
  });
});
