import { NextFunction, Request, Response } from 'express';
import { Story } from '../entity/Story';
import { getStory } from '../services/scraper';
import { Chapter } from '../entity/Chapter';
import { query } from '../db';

export class StoryController {
  async index(request: Request, response: Response, next: NextFunction) {
    const stories = await query('SELECT * FROM story;');
    const storyIds = stories.rows.map(story => story.id);
    const chapters = await query(
      `SELECT * FROM chapter WHERE chapter."storyId" IN (${storyIds.join(', ')})`,
    );
    return stories.rows.map(story => {
      const storyChapters = chapters.rows.filter(chapter => chapter.storyId === story.id);
      return { ...story, chapters: storyChapters };
    });
  }

  // async show(request: Request, response: Response, next: NextFunction) {
  //   console.log('controller');
  //   return 'CREATE STORY';
  // }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const storyData = await getStory(request.body.story_url);
      const story = storyData.story;
      const savedStory = await query(
        `INSERT INTO story(title, author, "canonicalUrl", details) VALUES($1, $2, $3, $4) RETURNING *;`,
        [story.title, story.author, story.url, story.details],
      );
      console.log(savedStory);
      savedStory.rows[0].chapters = [];
      for (const chapterData of storyData.chapters) {
        const savedChapter = await query(
          `INSERT INTO chapter("storyId", title, url, number, progress) VALUES($1, $2, $3, $4, $5) RETURNING *`,
          [savedStory.rows[0].id, chapterData.title, chapterData.url, chapterData.number, 0],
        );
        savedStory.rows[0].chapters.push(savedChapter.rows[0]);
      }

      return savedStory.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  // async destroy(request: Request, response: Response, next: NextFunction) {
  //   console.log('controller');
  //   return 'CREATE STORY';
  // }
}
