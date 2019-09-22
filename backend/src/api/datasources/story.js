const { DataSource } = require('apollo-datasource');
const { Story } = require('../../models/story');
const { getStory } = require('../../services/scraper');
const { Chapter } = require('../../models/Chapter');

class StoryAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  async getAllStories() {
    return await Story.allWithChapters();
  }

  async createStory(url) {
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
  }
  catch(error) {
    console.log(error);
  }
}

module.exports = StoryAPI;
