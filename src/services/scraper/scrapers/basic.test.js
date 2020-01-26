import Basic from './basic';
import { readFixture } from '#/helpers';
import Requester from '/services/requester';
import Cheerio from 'cheerio';

jest.mock('/services/requester');

test('it returns a standalone post with content equal to page body', async () => {
  const page = readFixture('paul_graham.html');
  const pageUrl = 'http://www.paulgraham.com/avg.html';
  Requester.get.mockResolvedValueOnce(Cheerio.load(page));

  const result = await Basic.attemptScrape(pageUrl);

  expect(result).toMatchInlineSnapshot(`
    Object {
      "content": "BODY_CONTENT",
      "title": "Beating the Averages",
      "url": "http://www.paulgraham.com/avg.html",
    }
  `);
});
