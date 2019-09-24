import { query } from '../db';
import { Chapter } from '../models/chapter';
import { DataSource } from 'apollo-datasource';

export class Story extends DataSource {
  static async all() {
    const result = await query('SELECT * FROM story;');
    return result.rows;
  }

  static async findBy(column: string, value: string) {
    const result = await query(
      `SELECT * FROM story WHERE story.${column}=$1 LIMIT 1;`,
      [value],
    );
    return result.rows[0];
  }

  static async find(id: number) {
    const result = await query(
      'SELECT * FROM story WHERE story.id=$1 LIMIT 1;',
      [id],
    );
    return result.rows[0];
  }

  static async allWithChapters() {
    const stories = await this.all();
    const storyIds = stories.map(story => story.id);
    const chapters = await Chapter.forStoryIds(storyIds);
    return stories.map(story => {
      const storyChapters = chapters.filter(
        chapter => chapter.storyId === story.id,
      );
      story.details = JSON.stringify(story.details);
      return { ...story, chapters: storyChapters };
    });
  }

  static async create(data) {
    const result = await query(
      'INSERT INTO story(title, author, "canonicalUrl", details) VALUES($1, $2, $3, $4) RETURNING *',
      [data.title, data.author, data.url, data.details],
    );
    return result.rows[0];
  }
}
