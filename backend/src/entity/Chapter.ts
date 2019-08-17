import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Story } from './Story';

@Entity()
export class Chapter {
  constructor(data = {}) {
    this.title = (data as any).title;
    this.url = (data as any).url;
    this.number = (data as any).number;
    this.progress = (data as any).progress || 0;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Story, story => story.chapters)
  story: Story;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  url: string;

  @Column()
  number: number;

  @Column()
  progress: number;
}
