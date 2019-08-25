import { Request, Response, NextFunction } from 'express';
import { Chapter } from '../entity/Chapter';
import { getChapterContent } from '../services/scraper';
import { query } from '../db';

export class ChapterController {
  async show(request: Request, response: Response, next: NextFunction) {
    const chapter = await query('SELECT * FROM chapter WHERE chapter.id=$1 LIMIT 1;', [
      request.params.id,
    ]);
    const story = await query('SELECT * FROM story WHERE story.id=$1 LIMIT 1;', [
      chapter.rows[0].storyId,
    ]);
    console.log(chapter);
    const chapterContent = await getChapterContent(chapter.rows[0]);
    return { ...chapter.rows[0], content: chapterContent, story: story.rows[0] };
  }
}
