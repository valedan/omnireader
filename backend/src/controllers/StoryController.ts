import { NextFunction, Request, Response } from 'express';
import { Story } from '../models/story';
import { getStory } from '../services/scraper';
import { Chapter } from '../models/chapter';

export class StoryController {
  async index(request: Request, response: Response, next: NextFunction) {
    const stories = await Story.allWithChapters();
    return stories;
  }

  // async show(request: Request, response: Response, next: NextFunction) {
  //   console.log('controller');
  //   return 'CREATE STORY';
  // }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const storyData = await getStory(request.body.story_url);
      const savedStory = await Story.create(storyData.story);
      savedStory.chapters = [];
      for (const chapterData of storyData.chapters) {
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
  }

  // async destroy(request: Request, response: Response, next: NextFunction) {
  //   console.log('controller');
  //   return 'CREATE STORY';
  // }
}
