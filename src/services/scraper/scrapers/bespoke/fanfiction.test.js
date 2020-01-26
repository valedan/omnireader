import axios from 'axios';
import FanFiction from './fanfiction';
import { readFixture, mockDBCountOnce } from '#/helpers';
import { HttpProxy } from '/models/http_proxy';

jest.mock('axios');
jest.mock('/models/http_proxy');

test('when the site is unsupported, returns false', async () => {
  const result = await FanFiction.attemptScrape('https://wrongurl.com', true);
  expect(result).toStrictEqual(false);
});

test('when there is no story at the url, returns false', async () => {
  const homepage = readFixture('ffn_homepage.html');
  axios.get.mockResolvedValueOnce({ data: homepage });
  mockDBCountOnce(HttpProxy, 0);
  const homepageUrl = 'https://www.fanfiction.net';

  const result = await FanFiction.attemptScrape(homepageUrl, true);

  expect(result).toStrictEqual(false);
});

test('when fetching a chapter, returns the chapter content', async () => {
  const hpmor = readFixture('ffn_hpmor_chapter_1.html');
  axios.get.mockResolvedValueOnce({ data: hpmor });
  mockDBCountOnce(HttpProxy, 0);
  const chapterUrl = 'https://www.fanfiction.net/s/123/1/HPMOR';

  const chapterData = await FanFiction.attemptScrape(chapterUrl, false);

  expect(chapterData).toMatchInlineSnapshot(`
    Object {
      "content": "<p>Chapter Content</p>",
      "number": 1,
      "title": "1. A Day of Very Low Probability",
      "url": "https://www.fanfiction.net/s/123/1/HPMOR",
    }
  `);
});

test('when fetching a 1-chapter story, returns correct data', async () => {
  const single = readFixture('ffn_single_chapter.html');
  axios.get.mockResolvedValueOnce({ data: single });
  mockDBCountOnce(HttpProxy, 0);
  const storyUrl = 'https://www.fanfiction.net/s/123/1/';

  const storyData = await FanFiction.attemptScrape(storyUrl, true);

  expect(storyData).toMatchInlineSnapshot(`
    Object {
      "author": "alexanderwales",
      "avatar": "https://ff74.b-cdn.net/image/2954488/75/",
      "canonicalUrl": "https://www.fanfiction.net/s/123/1/",
      "chapters": Array [
        Object {
          "number": 1,
          "title": "Instruments of Destruction",
          "url": "https://www.fanfiction.net/s/123/1/",
        },
      ],
      "details": Object {
        "description": "INSTRUMENTS_OF_DESCTRUCTION_TEST_DESCRIPTION",
        "information": "INSTRUMENTS_OF_DESCTRUCTION_TEST_INFO",
      },
      "title": "Instruments of Destruction",
    }
  `);
});

test('when fetching a multi-chapter story, returns correct data', async () => {
  const hpmor = readFixture('ffn_hpmor_chapter_1.html');
  axios.get.mockResolvedValueOnce({ data: hpmor });
  mockDBCountOnce(HttpProxy, 0);
  const storyUrl = 'https://www.fanfiction.net/s/123/1/HPMOR';

  const storyData = await FanFiction.attemptScrape(storyUrl, true);

  expect(storyData).toMatchInlineSnapshot(`
    Object {
      "author": "Less Wrong",
      "avatar": "https://ff74.b-cdn.net/image/80871/75/",
      "canonicalUrl": "https://www.fanfiction.net/s/123/1/HPMOR",
      "chapters": Array [
        Object {
          "number": 1,
          "title": "1. A Day of Very Low Probability",
          "url": "https://www.fanfiction.net/s/123/1/HPMOR",
        },
        Object {
          "number": 2,
          "title": "2. Everything I Believe Is False",
          "url": "https://www.fanfiction.net/s/123/2/HPMOR",
        },
        Object {
          "number": 3,
          "title": "3. Comparing Reality To Its Alternatives",
          "url": "https://www.fanfiction.net/s/123/3/HPMOR",
        },
      ],
      "details": Object {
        "description": "HPMOR_TEST_DESCRIPTION",
        "information": "HPMOR_TEST_INFO",
      },
      "title": "Harry Potter and the Methods of Rationality",
    }
  `);
});
