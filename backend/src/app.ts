import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes';
import Router from 'express-promise-router';
import * as cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

Routes.forEach(route => {
  router[route.method](
    route.route,
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await new route.controller()[route.action](req, res, next);
      res.json(result);
    },
  );
});

app.use('/', router);
export default app;
