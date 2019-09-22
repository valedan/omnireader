const { DataSource } = require('apollo-datasource');
const { Chapter } = require('../../models/Chapter');
const { Story } = require('../../models/story');
const { getChapterContent } = require('../../services/scraper');
class ChapterAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async getChapterWithContent(id) {
    const chapter = await Chapter.find(id);
    const story = await Story.find(chapter.storyId);
    const chapterContent = await getChapterContent(chapter);
    return {
      ...chapter,
      content: chapterContent,
      story: story,
    };
  }
}

module.exports = ChapterAPI;
