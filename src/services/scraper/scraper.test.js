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
    it('returns the first matching scraper', async () => {
      const expected = { story: 'foo' };
      const incompatibleScraper = jest.fn().mockResolvedValue(false);
      const compatibleScraper = jest.fn().mockResolvedValue(expected);

      // TODO: Is this leaking to other tests??
      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
        compatibleBespoke: {
          attemptScrape: compatibleScraper,
        },
      };

      const result = await scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(expected);
      expect(incompatibleScraper).toHaveBeenCalled();
      expect(compatibleScraper).toHaveBeenCalled();
      expect(ArticleScraper.attemptScrape).not.toHaveBeenCalled();
      expect(BasicScraper.attemptScrape).not.toHaveBeenCalled();
      expect(WordpressScraper.attemptScrape).not.toHaveBeenCalled();
    });
  });

  context('When there is a matching generic scraper', () => {
    it('returns the first matching scraper', async () => {
      const expected = { story: 'foo' };
      const incompatibleScraper = jest.fn().mockResolvedValue(false);
      WordpressScraper.attemptScrape.mockResolvedValue(expected);

      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
      };

      const result = await scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(expected);
      expect(incompatibleScraper).toHaveBeenCalled();
      expect(WordpressScraper.attemptScrape).toHaveBeenCalled();
      expect(ArticleScraper.attemptScrape).not.toHaveBeenCalled();
      expect(BasicScraper.attemptScrape).not.toHaveBeenCalled();
    });
  });

  context('When there are no matching scrapers', () => {
    it('returns false', async () => {
      const incompatibleScraper = jest.fn().mockResolvedValue(false);
      BespokeScrapers.default = {
        incompatibleBespoke: {
          attemptScrape: incompatibleScraper,
        },
      };

      WordpressScraper.attemptScrape.mockResolvedValueOnce(false);
      ArticleScraper.attemptScrape.mockResolvedValueOnce(false);
      BasicScraper.attemptScrape.mockResolvedValueOnce(false);

      const result = await scrape({ url: 'www.some.url', getStory: true });

      expect(result).toStrictEqual(false);
    });
  });
});
