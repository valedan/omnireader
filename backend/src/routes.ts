import { StoryController } from './controllers/StoryController';
import { ChapterController } from './controllers/ChapterController';

export const Routes = [
  {
    method: 'get',
    route: '/stories',
    controller: StoryController,
    action: 'index',
  },
  {
    method: 'get',
    route: '/stories/:id',
    controller: StoryController,
    action: 'show',
  },
  {
    method: 'post',
    route: '/stories',
    controller: StoryController,
    action: 'create',
  },
  {
    method: 'delete',
    route: '/stories/:id',
    controller: StoryController,
    action: 'destroy',
  },
  {
    method: 'get',
    route: '/chapters/:id',
    controller: ChapterController,
    action: 'show',
  },
];
