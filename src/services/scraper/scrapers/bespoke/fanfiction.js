import { URL } from 'url';
import { NoChapterError, NoStoryError } from '/errors';
import Requester from '/services/requester';

const attemptScrape = async (url, getStory) => {
  if (!isSupported(url)) return false;

  try {
    const $ = await Requester.get(url);
    return getStory ? extractStory($, url) : extractChapter($, url);
  } catch (err) {
    const expectedErrors = ['NoStoryError', 'NoChapterError'];
    if (!expectedErrors.includes(err.constructor.name)) {
      console.log(err);
    }
    return false;
  }
};

export default { attemptScrape };

const isSupported = url => {
  return new URL(url).hostname === 'www.fanfiction.net';
};

const extractStory = ($, url) => {
  validateStoryPresence($);
  return {
    ...extractStoryInfo($, url),
    chapters: extractChapterList($, url),
  };
};

const extractChapter = ($, url) => {
  validateChapterPresence($);
  const option = $('#chap_select')
    .first()
    .find('option[selected]')
    .first();
  return {
    ...extractChapterDataFromListOption($, url, option),
    content: $('#storytext')
      .html()
      .trim(),
  };
};

const extractChapterList = ($, url) => {
  if ($('#chap_select').length === 0) {
    return [
      {
        title: extractTitle($),
        url,
        number: 1,
      },
    ];
  } else {
    return $('#chap_select')
      .first()
      .find('option')
      .map((_, option) => {
        return extractChapterDataFromListOption($, url, option);
      })
      .get();
  }
};

const extractChapterDataFromListOption = ($, url, option) => {
  return {
    title: $(option).text(),
    url: url.replace(/\/s\/\d+\/\d+/, idMatch => {
      const parts = idMatch.split('/');
      parts[parts.length - 1] = $(option).attr('value');
      return parts.join('/');
    }),
    number: parseInt(
      $(option)
        .text()
        .split('.')[0],
      10,
    ),
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
  return {
    canonicalUrl: url,
    title: extractTitle($),
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
  if (!url.startsWith('http')) url = `https:${url}`;
  return url;
};

const extractTitle = $ => {
  return $('#profile_top .xcontrast_txt')
    .first()
    .text();
};
