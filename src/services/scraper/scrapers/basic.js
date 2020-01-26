import Requester from '/services/requester';

const attemptScrape = async url => {
  try {
    const $ = await Requester.get(url);
    return extractContent($, url);
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default { attemptScrape };

const extractContent = ($, url) => {
  return {
    title: $('title').text(),
    url: url,
    number: 1,
    content: $('body')
      .text()
      .trim(),
  };
};
