import { scrape } from './scraper';
import BasicScraper from './scrapers/article';
import ArticleScraper from './scrapers/basic';
import WordpressScraper from './scrapers/wordpress';
import * as BespokeScrapers from './scrapers/bespoke';

jest.mock('./scrapers/article');
jest.mock('./scrapers/basic');
jest.mock('./scrapers/wordpress');
jest.mock('./scrapers/bespoke');

describe('.scrape', () => {
  context('When there is a matching bespoke scraper', () => {
    it('returns the first matching scraper', () => {
      const expected = { story: 'foo' };
      const incompatibleScraper = jest.fn().mockReturnValue(false);
      const compatibleScraper = jest.fn().mockReturnValue(expected);

      // TODO: Is this leaking to other tests??
      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
        compatibleBespoke: {
          attemptScrape: compatibleScraper,
        },
      };

      const result = scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(expected);
      expect(incompatibleScraper).toHaveBeenCalled();
      expect(compatibleScraper).toHaveBeenCalled();
      expect(ArticleScraper.attemptScrape).not.toHaveBeenCalled();
      expect(BasicScraper.attemptScrape).not.toHaveBeenCalled();
      expect(WordpressScraper.attemptScrape).not.toHaveBeenCalled();
    });
  });

  context('When there is a matching generic scraper', () => {
    it('returns the first matching scraper', () => {
      const expected = { story: 'foo' };
      const incompatibleScraper = jest.fn().mockReturnValue(false);
      WordpressScraper.attemptScrape.mockReturnValueOnce(expected);

      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
      };

      const result = scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(expected);
      expect(incompatibleScraper).toHaveBeenCalled();
      expect(WordpressScraper.attemptScrape).toHaveBeenCalled();
      expect(ArticleScraper.attemptScrape).not.toHaveBeenCalled();
      expect(BasicScraper.attemptScrape).not.toHaveBeenCalled();
    });
  });

  context('When there are no matching scrapers', () => {
    it('returns false', () => {
      const incompatibleScraper = jest.fn().mockReturnValue(false);
      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
      };

      WordpressScraper.attemptScrape.mockReturnValueOnce(false);
      ArticleScraper.attemptScrape.mockReturnValueOnce(false);
      BasicScraper.attemptScrape.mockReturnValueOnce(false);

      const result = scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(false);
    });
  });
});
