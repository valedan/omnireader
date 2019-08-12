import { NextFunction, Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Story } from '../entity/Story';
import { getStory } from '../services/scraper';

export class StoryController {
  async index(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }

  async show(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const foo = 'foobar';
    [1, 2, 3].map(n => {
      console.log(n);
      debugger;
    });
    // try {
    //   const storyData = await getStory(request.body.story_url);
    //   const connection = getConnection();
    //   const story = new Story(storyData);
    //   await connection.manager.save(story);
    //   return story;
    // } catch (error) {
    //   console.log(error);
    // }
  }

  async destroy(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }
}
