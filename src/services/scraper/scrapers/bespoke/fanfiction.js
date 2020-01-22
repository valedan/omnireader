import { URL } from 'url';
import axios from 'axios';
import { NoChapterError, NoStoryError } from '/errors';
import * as Cheerio from 'cheerio';
import { HttpProxy } from '/models/http_proxy';

const attemptScrape = async (url, getStory) => {
  if (!isSupported(url)) return false;

  const page = await getWithProxy(url);
  const nodeset = Cheerio.load(page.data);

  return getStory ? extractStory(nodeset) : extractChapter(nodeset);
};

export default { attemptScrape };

const isSupported = url => new URL(url).hostname === 'www.fanfiction.net';

const getWithProxy = async url => {
  const count = await HttpProxy.query().count();
  if (count[0].count > 0) {
    const proxy = await HttpProxy.query().first();
    return axios.get(url, {
      proxy: {
        host: proxy.ip,
        port: proxy.port,
        auth: {
          username: proxy.username,
          password: proxy.password,
        },
      },
    });
  }

  return axios.get(url);
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
    number: parseInt(option.text().split('.')[0], 10),
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

const extractStory = ($, url) => {
  validateStoryPresence($);
  return {
    ...extractStoryInfo(nodeSet, url),
    chapters:
      extractChapterList(nodeSet, url) || extractSingleChapter(nodeSet, url),
  };
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

const extractSingleChapter = ($, url) => {
  return [
    {
      title: extractTitle($),
      url,
      number: 1,
    },
  ];
};

const extractChapterList = ($, url) => {
  if ($('#chap_select').length === 0) return null;
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
