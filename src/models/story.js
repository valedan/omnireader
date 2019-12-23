import { Model } from 'objection';

export class Story extends Model {
  static tableName = 'stories';

  static relationMappings = {
    chapters: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/chapter`,
      join: {
        from: 'chapters.storyId',
        to: 'stories.id',
      },
    },
  };
}
