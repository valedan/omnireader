import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes';
import * as cors from 'cors';

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

Routes.forEach(route => {
  app[route.method](route.route, (req, res, next) => {
    const result = new route.controller()[route.action](req, res, next);
    if (result instanceof Promise) {
      result.then(result => res.json(result)).catch(next);
    } else {
      res.json(result);
    }
  });
});

export default app;
