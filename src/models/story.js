import { Model } from 'objection';

export class Story extends Model {
  static get tableName() {
    return 'stories';
  }

  static relationMappings() {
    return {
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
}
