import repl from 'repl';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from './knexfile';
import * as Models from './src/models';

const knex =
  process.env.NODE_ENV === 'production'
    ? Knex(knexConfig.production)
    : Knex(knexConfig.development);

Model.knex(knex);

const replServer = repl.start('>');

Object.keys(Models).forEach(modelName => {
  replServer.context[modelName] = Models[modelName];
});
