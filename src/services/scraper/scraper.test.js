import { scrape } from './scraper';
import * as BespokeScrapers from './scrapers/bespoke';
// https://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest

describe('.scrape', () => {
  context('When there is a matching bespoke scraper', () => {
    it('returns the data from the successful scrape', () => {
      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: async () => false,
        },
        compatibleBespoke: {
          attemptScrape: async () => {
            return { story: 'foo' };
          },
        },
      };

      const result = scrape({ url: 'www.some.url', getStory: true });
      expect(result).toStrictEqual({ story: 'foo' });

      // spy.mockRestore();
    });
  });

  context('When there is a later match', () => {});

  context('When there are multiple matches', () => {});

  context('When there are no matches', () => {});
});
