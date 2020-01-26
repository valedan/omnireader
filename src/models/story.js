import { Model } from 'objection';

export class Story extends Model {
  static get tableName() {
    return 'stories';
  }

  static relationMappings() {
    return {
      posts: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/post`,
        join: {
          from: 'posts.storyId',
          to: 'stories.id',
        },
      },
    };
  }
}
