import { Model } from 'objection';

export class Chapter extends Model {
  static tableName = 'chapters';

  static relationMappings = {
    story: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/story`,
      join: {
        from: 'stories.id',
        to: 'chapters.storyId',
      },
    },
  };
}
