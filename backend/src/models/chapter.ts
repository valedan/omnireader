import { query } from '../db';

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

  static async find(id: number) {
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
