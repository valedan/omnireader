import { Request, Response, NextFunction } from 'express';
import { Chapter } from '../models/Chapter';
import { Story } from '../models/story';
import { getChapterContent } from '../services/scraper';
import { query } from '../db';

export class ChapterController {
  async show(request: Request, response: Response, next: NextFunction) {
    const chapter = await Chapter.find(request.params.id);
    const story = await Story.find(chapter.storyId);
    const chapterContent = await getChapterContent(chapter);
    return {
      ...chapter,
      content: chapterContent,
      story: story,
    };
  }
}
