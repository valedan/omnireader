import { Request, Response, NextFunction } from 'express';
import { Client } from 'pg';
import { Chapter } from '../entity/Chapter';
import { getChapterContent } from '../services/scraper';

export class ChapterController {
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const client = new Client({
        user: 'dan',
        host: 'localhost',
        port: '5432',
        database: 'omnireader_dev',
        password: '',
      });

      const chapter = await client.query('SELECT * FROM chapter WHERE chapter.id=2620 LIMIT 1;');
      console.log(chapter);
      const chapterContent = await getChapterContent(chapter);
      return { ...chapter, content: chapterContent };
    } catch (error) {
      console.log(error);
    }
  }
}
