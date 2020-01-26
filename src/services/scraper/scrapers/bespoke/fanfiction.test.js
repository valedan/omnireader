import FanFiction from './fanfiction';
import { readFixture } from '#/helpers';
import Requester from '/services/requester';
import Cheerio from 'cheerio';

jest.mock('/services/requester');

test('when the site is unsupported, returns false', async () => {
  const result = await FanFiction.attemptScrape('https://wrongurl.com', true);
  expect(result).toStrictEqual(false);
});

test('when there is no story at the url, returns false', async () => {
  const homepage = readFixture('ffn_homepage.html');
  const homepageUrl = 'https://www.fanfiction.net';
  Requester.get.mockResolvedValueOnce(Cheerio.load(homepage));

  const result = await FanFiction.attemptScrape(homepageUrl, true);

  expect(result).toStrictEqual(false);
});

test('when fetching a post, returns the post content', async () => {
  const hpmor = readFixture('ffn_hpmor_chapter_1.html');
  const postUrl = 'https://www.fanfiction.net/s/123/1/HPMOR';
  Requester.get.mockResolvedValueOnce(Cheerio.load(hpmor));

  const postData = await FanFiction.attemptScrape(postUrl, false);

  expect(postData).toMatchInlineSnapshot(`
    Object {
      "content": "<p>Post Content</p>",
      "number": 1,
      "title": "1. A Day of Very Low Probability",
      "url": "https://www.fanfiction.net/s/123/1/HPMOR",
    }
  `);
});

test('when fetching a 1-post story, returns correct data', async () => {
  const single = readFixture('ffn_single_chapter.html');
  const storyUrl = 'https://www.fanfiction.net/s/123/1/';
  Requester.get.mockResolvedValueOnce(Cheerio.load(single));

  const storyData = await FanFiction.attemptScrape(storyUrl, true);

  expect(storyData).toMatchInlineSnapshot(`
    Object {
      "author": "alexanderwales",
      "avatar": "https://ff74.b-cdn.net/image/2954488/75/",
      "canonicalUrl": "https://www.fanfiction.net/s/123/1/",
      "details": Object {
        "description": "INSTRUMENTS_OF_DESCTRUCTION_TEST_DESCRIPTION",
        "information": "INSTRUMENTS_OF_DESCTRUCTION_TEST_INFO",
      },
      "posts": Array [
        Object {
          "number": 1,
          "title": "Instruments of Destruction",
          "url": "https://www.fanfiction.net/s/123/1/",
        },
      ],
      "title": "Instruments of Destruction",
    }
  `);
});

test('when fetching a multi-post story, returns correct data', async () => {
  const hpmor = readFixture('ffn_hpmor_chapter_1.html');
  const storyUrl = 'https://www.fanfiction.net/s/123/1/HPMOR';
  Requester.get.mockResolvedValueOnce(Cheerio.load(hpmor));

  const storyData = await FanFiction.attemptScrape(storyUrl, true);

  expect(storyData).toMatchInlineSnapshot(`
    Object {
      "author": "Less Wrong",
      "avatar": "https://ff74.b-cdn.net/image/80871/75/",
      "canonicalUrl": "https://www.fanfiction.net/s/123/1/HPMOR",
      "details": Object {
        "description": "HPMOR_TEST_DESCRIPTION",
        "information": "HPMOR_TEST_INFO",
      },
      "posts": Array [
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
      "title": "Harry Potter and the Methods of Rationality",
    }
  `);
});
