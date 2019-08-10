import Axios from 'axios';
import * as Cheerio from 'cheerio';

export const fetchStory = async (url: string) => {
  const story = await Axios.get(url);
  const $ = Cheerio.load(story.data);

  return {
    url: url,
    title: $('#profile_top .xcontrast_txt')
      .first()
      .text(),
    author: $('#profile_top .xcontrast_txt')
      .eq(2)
      .text(),
    details: {
      description: $('#profile_top div.xcontrast_txt').text(),
      information: $('#profile_top span.xgray.xcontrast_txt')
        .text()
        .replace(/\s{2,}/g, ' '),
    },
  };
};
