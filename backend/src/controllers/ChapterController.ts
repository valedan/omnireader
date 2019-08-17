import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import { Chapter } from '../entity/Chapter';
import { getChapterContent } from '../services/scraper';

export class ChapterController {
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const connection = getConnection();
      const chapter = await connection
        .getRepository(Chapter)
        .findOne(request.params.id, { relations: ['story'] });
      const chapterContent = await getChapterContent(chapter);
      return { ...chapter, content: chapterContent };
    } catch {}
  }
}
