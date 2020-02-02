import BasicScraper from './scrapers/article';
import ArticleScraper from './scrapers/basic';
import WordpressScraper from './scrapers/wordpress';
import BespokeScrapers from './scrapers/bespoke';

export const scrape = async ({ url, getStory }) => {
  let bespokeResult = null;
  for (const scraper of Object.values(BespokeScrapers)) {
    bespokeResult = await scraper.attemptScrape(url, getStory);
    if (bespokeResult) break;
  }
  return (
    bespokeResult ||
    (await WordpressScraper.attemptScrape(url, getStory)) ||
    (await ArticleScraper.attemptScrape(url, getStory)) ||
    (await BasicScraper.attemptScrape(url))
  );
};
