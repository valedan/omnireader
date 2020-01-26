import BasicScraper from './scrapers/article';
import ArticleScraper from './scrapers/basic';
import WordpressScraper from './scrapers/wordpress';
import BespokeScrapers from './scrapers/bespoke';

export const scrape = ({ url, getStory }) => {
  let bespokeResult = null;
  for (const scraper of Object.values(BespokeScrapers)) {
    bespokeResult = scraper.attemptScrape(url, getStory);
    if (bespokeResult) break;
  }
  return (
    bespokeResult ||
    WordpressScraper.attemptScrape(url, getStory) ||
    ArticleScraper.attemptScrape(url, getStory) ||
    BasicScraper.attemptScrape(url)
  );
};
