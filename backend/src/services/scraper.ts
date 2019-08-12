import { URL } from 'url';
import Axios from 'axios';
import * as Cheerio from 'cheerio';

const getStory = async (url: string) => {
  validateUrl(url);

  const story = await Axios.get(url);
  const $ = Cheerio.load(story.data);

  return {
    story: {
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
    },
    chapters: parseChapterList($, url),
  };
};

const getChapter = async (url: string) => {
  validateUrl(url);
};

const validateUrl = (url: string) => {
  const uri = new URL(url);
  if (uri.hostname !== 'www.fanfiction.net') {
    throw TypeError('site is not supported!');
  }
};

function parseChapterList($, url: string) {
  const uri = url;
  const a = 10;
  let b = 2;
  var c = 3;
  // function callback(num) {
  //   console.log(uri);
  //   console.log(a);
  // }
  // [1, 2, 2].forEach(callback);
  [1, 2, 3].map(num => {
    console.log(uri);
  });
  return $('#chap_select')
    .first()
    .find('option')
    .map(option => {
      console.log('uri');
      console.log('uri');
      console.log('uri');
      console.log('uri');
      console.log('uri');
    });
}
export { getStory, getChapter, validateUrl };
