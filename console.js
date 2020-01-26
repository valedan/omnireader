import repl from 'repl';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from './knexfile';
import { Story } from './src/models/story';
import { Post } from './src/models/post';
import { HttpProxy } from './src/models/http_proxy';

const knex =
  process.env.NODE_ENV === 'production'
    ? Knex(knexConfig.production)
    : Knex(knexConfig.development);

Model.knex(knex);

const replServer = repl.start('>');

replServer.context.Story = Story;
replServer.context.Post = Post;
replServer.context.HttpProxy = HttpProxy;
