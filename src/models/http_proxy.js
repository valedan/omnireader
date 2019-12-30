import { Model } from 'objection';

export class HttpProxy extends Model {
  static get tableName() {
    return 'proxies';
  }
}
