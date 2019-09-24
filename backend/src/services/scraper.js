import { URL } from 'url';
import Axios from 'axios';
import { Story } from '../models/story';
import { Chapter } from '../models/chapter';
import * as Cheerio from 'cheerio';

const createStory = async url => {
  try {
    const storyData = await getStory(url);
    const savedStory = await Story.create(storyData.story);
    savedStory.details = JSON.stringify(savedStory.details);
    savedStory.chapters = [];
    for (const chapterData of storyData.chapters) {
      console.log('getting chapter');
      const savedChapter = Chapter.create({
        ...chapterData,
        storyId: savedStory.id,
      });
      savedStory.chapters.push(savedChapter);
    }

    return savedStory;
  } catch (error) {
    console.log(error);
  }
};

const getStory = async url => {
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

const getChapterContent = async chapter => {
  const page = await Axios.get(chapter.url);
  const $ = Cheerio.load(page.data);
  return $('#storytext').text();
};

const getChapter = async url => {
  validateUrl(url);
};

const validateUrl = url => {
  const uri = new URL(url);
  if (uri.hostname !== 'www.fanfiction.net') {
    throw TypeError('site is not supported!');
  }
};

function parseChapterList($, url) {
  return $('#chap_select')
    .first()
    .find('option')
    .map((index, option) => {
      return {
        title: $(option).text(),
        url: url.replace(/\/s\/\d+\/\d+/, idMatch => {
          const parts = idMatch.split('/');
          parts[parts.length - 1] = $(option).attr('value');
          return parts.join('/');
        }),
        number: index + 1,
      };
    })
    .get();
}
export { getStory, getChapter, validateUrl, getChapterContent, createStory };