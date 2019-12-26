import repl from 'repl';
import Knex from 'knex';
import knexConfig from './knexfile';
import { Model } from 'objection';
import { Story } from './src/models/story';
import { Chapter } from './src/models/chapter';
import { HttpProxy } from './src/models/http_proxy';

const knex =
  process.env.NODE_ENV === 'production'
    ? Knex(knexConfig.production)
    : Knex(knexConfig.development);

Model.knex(knex);

const replServer = repl.start('>');

replServer.context.Story = Story;
replServer.context.Chapter = Chapter;
replServer.context.HttpProxy = HttpProxy;
