import { NextFunction, Request, Response } from 'express';
import { fetchStory } from '../services/storyFetcher';
import { getConnection } from 'typeorm';
import { Story } from '../entity/Story';
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
    try {
      const data = await fetchStory(request.body.story_url);
      const connection = getConnection();
      console.log(data);
      let story = new Story(data);
      await connection.manager.save(story);
      const loaded = await connection.manager.find(Story);
      console.log(loaded);
      return data;
    } catch (error) {
      console.log(error);
    }
    return 'CREATE STORY';
  }

  async destroy(request: Request, response: Response, next: NextFunction) {
    console.log('controller');
    return 'CREATE STORY';
  }
}
