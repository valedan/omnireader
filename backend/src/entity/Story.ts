import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Story {
  constructor(data = {}) {
    this.title = data.title;
    this.author = data.author;
    this.details = data.details;
    this.canonicalUrl = data.url;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  canonicalUrl: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'json' })
  details: object;
}
