import { NextFunction, Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Story } from '../entity/Story';
import { getStory } from '../services/scraper';
import { Chapter } from '../entity/Chapter';

export class StoryController {
  async index(request: Request, response: Response, next: NextFunction) {
    const connection = getConnection();
    return connection.getRepository(Story).find({ relations: ['chapters'] });
  }

  async show(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const storyData = await getStory(request.body.story_url);
      const connection = getConnection();
      const story = new Story(storyData.story);
      await connection.manager.save(story);
      for (const chapterData of storyData.chapters) {
        const chapter = new Chapter(chapterData);
        chapter.story = story;
        await connection.manager.save(chapter);
      }
      const storyRepository = connection.getRepository(Story);
      const savedStory = await storyRepository.findOne({
        where: { id: story.id },
        relations: ['chapters'],
      });
      return savedStory;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }
}
