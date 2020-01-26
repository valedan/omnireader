import { Model } from 'objection';

export class Post extends Model {
  static get tableName() {
    return 'posts';
  }

  static get relationMappings() {
    return {
      story: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/story`,
        join: {
          from: 'stories.id',
          to: 'posts.storyId',
        },
      },
    };
  }
}
