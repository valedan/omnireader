import { Model } from 'objection';

export class Story extends Model {
  static tableName = 'stories';

  static relationMappings = {
    chapters: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/Chapter`,
      join: {
        from: 'chapters.storyId',
        to: 'stories.id',
      },
    },
  };
}
