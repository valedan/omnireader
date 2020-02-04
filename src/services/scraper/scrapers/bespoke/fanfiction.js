import { URL } from 'url';
import { NoPostError, NoStoryError } from '/errors';
import Requester from '/services/requester';

const attemptScrape = async (url, getStory) => {
  if (!isSupported(url)) return false;
  try {
    const $ = await Requester.get(url);
    return getStory ? extractStory($, url) : extractPost($, url);
  } catch (err) {
    const expectedErrors = ['NoStoryError', 'NoPostError'];
    if (!expectedErrors.includes(err.constructor.name)) {
      // console.log(err);
    }
    return false;
  }
};

export default { attemptScrape };

const isSupported = url => {
  return new URL(url).hostname === 'www.fanfiction.net';
};

const extractStory = ($, url) => {
  validatePostPresence($);
  return {
    ...extractStoryInfo($, url),
    posts: extractPostList($, url),
  };
};

const extractPost = ($, url) => {
  validatePostPresence($);
  const option = $('#chap_select')
    .first()
    .find('option[selected]')
    .first();
  return {
    ...extractPostDataFromListOption($, url, option),
    content: $('#storytext')
      .html()
      .trim(),
  };
};

const extractPostList = ($, url) => {
  console.log($('#chap_select').text());
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
        return extractPostDataFromListOption($, url, option);
      })
      .get();
  }
};

const extractPostDataFromListOption = ($, url, option) => {
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

const validatePostPresence = $ => {
  if (!$('#storytext').text()) throw new NoPostError();
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
