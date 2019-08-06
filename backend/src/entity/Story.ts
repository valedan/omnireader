import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Story {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "text"})
  canonicalUrl: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({type: "json"})
  details: object;
}