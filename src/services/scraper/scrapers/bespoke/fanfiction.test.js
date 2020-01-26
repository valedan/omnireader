import axios from 'axios';
import FanFiction from './fanfiction';
import { readFixture, mockDBCountOnce } from '#/helpers';
import { HttpProxy } from '/models/http_proxy';

jest.mock('axios');
jest.mock('/models/http_proxy');

describe('fetching the whole story', () => {
  // context('When site is unsupported', () => {
  //   it('returns false', async () => {
  //     const result = await FanFiction.attemptScrape('https://badurl.com', true);
  //     expect(result).toStrictEqual(false);
  //   });
  // });

  context('When there is no story at provided url', () => {
    it('returns false', async () => {
      const homepage = readFixture('ffn_homepage.html');

      axios.get.mockResolvedValueOnce({ data: homepage });

      const result = await FanFiction.attemptScrape(
        'https://www.fanfiction.net',
        true,
      );

      expect(result).toStrictEqual(false);
    });
  });

  context('When the story only has 1 chapter', () => {
    it('returns the parsed story data', async () => {
      const single = readFixture('ffn_single_chapter.html');

      mockDBCountOnce(HttpProxy, 0);
      axios.get.mockResolvedValueOnce({ data: single });

      const storyData = await FanFiction.attemptScrape(
        'https://www.fanfiction.net/s/123/1',
        true,
      );

      expect(storyData.chapters[0].title).toStrictEqual(
        'Instruments of Destruction',
      );
    });
  });

  // it('returns the parsed story data', async () => {
  //   const hpmor = readFixture('ffn_hpmor_chapter_1.html');
  //   mockDBCountOnce(HttpProxy, 0);

  //   axios.get.mockResolvedValueOnce({ data: hpmor });

  //   const storyData = await FanFiction.attemptScrape(
  //     'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
  //     true,
  //   );

  //   expect(storyData).toMatchInlineSnapshot(`
  //     Object {
  //       "author": "Less Wrong",
  //       "avatar": "https://ff74.b-cdn.net/image/80871/75/",
  //       "canonicalUrl": "https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality",
  //       "chapters": Array [
  //         Object {
  //           "number": 1,
  //           "title": "1. A Day of Very Low Probability",
  //           "url": "https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality",
  //         },
  //         Object {
  //           "number": 2,
  //           "title": "2. Everything I Believe Is False",
  //           "url": "https://www.fanfiction.net/s/5782108/2/Harry-Potter-and-the-Methods-of-Rationality",
  //         },
  //         Object {
  //           "number": 3,
  //           "title": "3. Comparing Reality To Its Alternatives",
  //           "url": "https://www.fanfiction.net/s/5782108/3/Harry-Potter-and-the-Methods-of-Rationality",
  //         },
  //       ],
  //       "details": Object {
  //         "description": "Petunia married a biochemist, and Harry grew up reading science and science fiction. Then came the Hogwarts letter, and a world of intriguing new possibilities to exploit. And new friends, like Hermione Granger, and Professor McGonagall, and Professor Quirrell... COMPLETE.",
  //         "information": "Rated: Fiction T - English - Drama/Humor - Harry P., Hermione G. - Chapters: 122 - Words: 661,619 - Reviews: 34,596 - Favs: 23,879 - Follows: 17,999 - Updated: 3/14/2015 - Published: 2/28/2010 - Status: Complete - id: 5782108",
  //       },
  //       "title": "Harry Potter and the Methods of Rationality",
  //     }
  //   `);
  // });
});

// describe('fetching a single chapter', () => {
//   context('When the site is not supported', () => {
//     it('returns false', async () => {
//       const result = await FanFiction.attemptScrape(
//         'https://badurl.com',
//         false,
//       );
//       expect(result).toStrictEqual(false);
//     });
//   });

//   context('When there is no chapter at the url', () => {
//     it('returns false', async () => {
//       const homepage = readFixture('ffn_homepage.html');
//       mockDBCountOnce(HttpProxy, 0);

//       axios.get.mockResolvedValueOnce({ data: homepage });

//       const chapterData = await FanFiction.attemptScrape(
//         'https://www.fanfiction.net',
//         false,
//       );
//       expect(chapterData).toStrictEqual(false);
//     });
//   });

//   it('returns the content of the chapter', async () => {
//     const hpmor = readFixture('ffn_hpmor_chapter_1.html');
//     mockDBCountOnce(HttpProxy, 0);

//     axios.get.mockResolvedValueOnce({ data: hpmor });

//     const chapterData = await FanFiction.attemptScrape(
//       'https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality',
//       false,
//     );

//     expect(chapterData).toMatchInlineSnapshot(`
//       Object {
//         "content": "<p>Chapter Content</p>",
//         "number": 1,
//         "title": "1. A Day of Very Low Probability",
//         "url": "https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality",
//       }
//     `);
//   });
// });
