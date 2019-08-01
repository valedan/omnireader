var express = require('express');
var axios = require('axios')
var cheerio = require('cheerio')
var router = express.Router();

/* GET home page. */
  router.get('/chapter', async function(req, res, next) {
    const chapter = await axios.get(req.query.url)
    try{
      const $ = cheerio.load(chapter.data)
      const data = {
        storyTitle: $('#profile_top .xcontrast_txt').first().text(),
        authorName: $('#profile_top .xcontrast_txt').eq(2).text(),
        storyDescription: $('#profile_top div.xcontrast_txt').text(),
        storyInformation: $('#profile_top span.xgray.xcontrast_txt').text().replace(/\s{2,}/g, ' '),
        content: $.html('#storytext')
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data))
    } catch(error) {
      console.log(error)
    }
  })
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
