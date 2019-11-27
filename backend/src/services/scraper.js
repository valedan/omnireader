import { URL } from 'url';
import axios from 'axios';
import * as Cheerio from 'cheerio';

export class UnsupportedSiteError extends Error {}
export class NoStoryError extends Error {}
export class NoChapterError extends Error {}

export const fetchStory = async url => {
  validateUrl(url);

  const story = await axios.get(url);
  const nodeSet = Cheerio.load(story.data);

  return {
    ...extractStoryInfo(nodeSet, url),
    chapters: extractChapterList(nodeSet, url),
  };
};

export const fetchChapter = async url => {
  validateUrl(url);
  const chapter = await axios.get(url);
  const nodeSet = Cheerio.load(chapter.data);

  return extractChapter(nodeSet, url);
};

const extractChapter = ($, url) => {
  validateChapterPresence($);
  const option = $('#chap_select')
    .first()
    .find('option[selected]')
    .first();
  return {
    title: $(option).text(),
    url: url.replace(/\/s\/\d+\/\d+/, idMatch => {
      const parts = idMatch.split('/');
      parts[parts.length - 1] = $(option).attr('value');
      return parts.join('/');
    }),
    number: parseInt(option.text().split('.')[0]),
    content: $('#storytext')
      .html()
      .trim(),
  };
};

const validateChapterPresence = $ => {
  if (!$('#storytext').text()) throw new NoChapterError();
};

const validateStoryPresence = $ => {
  const title = $('#profile_top .xcontrast_txt')
    .first()
    .text();
  if (!title.length) throw new NoStoryError();
};

const extractStoryInfo = ($, url) => {
  validateStoryPresence($);
  return {
    canonicalUrl: url,
    title: $('#profile_top .xcontrast_txt')
      .first()
      .text(),
    author: $('#profile_top .xcontrast_txt')
      .eq(2)
      .text(),
    avatar: extractAvatar($),
    details: {
      description: $('#profile_top div.xcontrast_txt').text(),
      information: $('#profile_top span.xgray.xcontrast_txt')
        .text()
        .replace(/\s{2,}/g, ' ')
        .trim(),
    },
  };
};

const extractAvatar = $ => {
  let url = $('#profile_top img').attr('src');
  if (!url) return null;
  if (!url.startsWith('http')) url = 'https:' + url;
  return url;
};

const validateUrl = url => {
  const uri = new URL(url);
  if (uri.hostname !== 'www.fanfiction.net') {
    throw new UnsupportedSiteError();
  }
};

const extractChapterList = ($, url) => {
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
};
