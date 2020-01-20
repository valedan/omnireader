import * as Article from './scrapers/article';
import * as Basic from './scrapers/basic';
import * as Wordpress from './scrapers/wordpress';
import { default as Bespoke } from './scrapers/bespoke';

export const scrape = ({ url, getStory }) => {
  return (
    Bespoke.find(bespoke => {
      bespoke.attemptScrape(url, getStory);
    }) ||
    Wordpress.attemptScrape(url, getStory) ||
    Article.attemptScrape(url, getStory) ||
    Basic.attemptScrape(url, getStory)
  );
};
