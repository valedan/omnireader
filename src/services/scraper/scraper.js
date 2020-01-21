import * as Article from './scrapers/article';
import * as Basic from './scrapers/basic';
import * as Wordpress from './scrapers/wordpress';
import BespokeScrapers from './scrapers/bespoke';

export const scrape = ({ url, getStory }) => {
  return (
    Object.values(BespokeScrapers).find(async bespoke => {
      const result = await bespoke.attemptScrape(url, getStory);
      console.log(result);
      return result;
      // find can't work here, it returns the item not the result. need to abstract this
    }) ||
    Wordpress.attemptScrape(url, getStory) ||
    Article.attemptScrape(url, getStory) ||
    Basic.attemptScrape(url, getStory)
  );
};
