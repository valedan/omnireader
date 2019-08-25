import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { Routes } from './routes';
import * as cors from 'cors';

createConnection()
  .then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.options('*', cors());

    // register express routes from defined application routes
    Routes.forEach(route => {
      (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](req, res, next);
        if (result instanceof Promise) {
          console.log('promise!!!');
          result
            .then(result => {
              console.log('result!!!');
              console.log(result);
              result !== null && result !== undefined ? res.send(result) : undefined;
            })
            .catch(error => {
              console.log(error);
            });
        } else if (result !== null && result !== undefined) {
          console.log(result);
          res.json(result);
        } else {
          console.log('else');
          console.log(result);
        }
      });
    });

    app.listen(3000);
  })
  .catch(error => console.log(error));
