import Basic from './basic';
import { readFixture } from '#/helpers';
import nock from 'nock';
import { HttpProxy } from '/models/http_proxy';

jest.mock('/models/http_proxy');

test('it returns a standalone post with content equal to page body', async () => {
  const page = readFixture('paul_graham.html');
  const pageUrl = 'http://www.paulgraham.com/avg.html';
  nock('http://www.paulgraham.com')
    .get('/avg.html')
    .reply(200, page);

  HttpProxy.query.mockImplementation(() => {
    return { count: () => [{ count: 0 }] };
  });

  const result = await Basic.attemptScrape(pageUrl);

  //TODO: jquery body selector not working right
  expect(result).toMatchInlineSnapshot(`
    Object {
      "content": "Beating the Averages
        
        
      
      
        BODY_CONTENT",
      "title": "",
      "url": "http://www.paulgraham.com/avg.html",
    }
  `);
});
