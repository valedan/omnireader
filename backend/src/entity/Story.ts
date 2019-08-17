import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Chapter } from './Chapter';

@Entity()
export class Story {
  constructor(data = {}) {
    this.title = (data as any).title;
    this.author = (data as any).author;
    this.details = (data as any).details;
    this.canonicalUrl = (data as any).url;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Chapter, chapter => chapter.story)
  chapters: Chapter[];

  @Column({ type: 'text' })
  canonicalUrl: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'json' })
  details: object;
}
