import { Model } from 'objection';

export class Chapter extends Model {
  static tableName = 'chapters';

  static relationMappings = {
    story: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/Story`,
      join: {
        from: 'stories.id',
        to: 'chapters.storyId',
      },
    },
  };
}
