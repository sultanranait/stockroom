import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Router } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from '../middlewares/error.handler';
import { requestLogger } from '../middlewares/request.logger';
import { sequelize } from '../models';
import config from './index';
import logger from './logger';
import { rateLimiter } from './rate.limiter';

export const createApp = (basePath: string, router: Router) => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(basePath, rateLimiter.api, router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startServer = async (app: Express, port: number, name: string) => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    app.listen(port, (error) => {
      if (error) throw error;
      logger.info(`${name} service listening on port ${port}`);
    });
  } catch (error) {
    logger.error(`${name} service failed to start`, {
      error: (error as Error).message,
    });
    process.exit(1);
  }
};
