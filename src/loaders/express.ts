import express, {JSONOptions} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../controllers/http';
import config from '../config';

export default ({ app }: { app: express.Application }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // cors
  app.use(cors());

  // middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // load API routes
  app.use(config.api.prefix, routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const errorJson: JSONOptions = {errorMessage: err.message};
    res.json(errorJson);
  });
};
