import { query } from '../db';
import { Story } from './story';
import { getChapterContent } from '../services/scraper';

export class Chapter {
  id?: number;
  storyId: number;
  title: string;
  url: string;
  number: number;
  fullText?: string;

  constructor(data?: object) {}

  static async forStoryIds(storyIds: Array<number>) {
    const idString = storyIds.join(', ');
    const result = await query(
      `SELECT * FROM chapter WHERE chapter."storyId" IN (${idString})`,
    );
    return result.rows;
  }

  static async chapterWithContent(id) {
    const chapter = await this.find(id);
    const story = await Story.find(chapter.storyId);
    const chapterContent = await getChapterContent(chapter);
    return {
      ...chapter,
      content: chapterContent,
      story: story,
    };
  }
  static async find(id) {
    const result = await query(
      'SELECT * FROM chapter WHERE chapter.id=$1 LIMIT 1;',
      [id],
    );
    return result.rows[0];
  }

  static async create(data) {
    const result = await query(
      `INSERT INTO chapter("storyId", title, url, number, progress) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [data.storyId, data.title, data.url, data.number, 0],
    );
    return result.rows[0];
  }
}
