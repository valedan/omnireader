import { Model } from 'objection';

export class Chapter extends Model {
  static get tableName() {
    return 'chapters';
  }

  static get relationMappings() {
    return {
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
}
