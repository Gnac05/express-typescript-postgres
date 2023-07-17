import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import config from '@config';
import { dbSource } from '@database';
import { logger, stream } from '@utils/logger';
import Features from '@features';
import http from 'http';
import passport from 'passport';
import { jwtStrategy } from '@config/passport';
import { errorConverter, errorHandler } from '@middlewares/error';
import httpStatus from 'http-status';
import ApiError from './utils/ApiError';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public features: Features;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.env = config.env || 'development';
    this.port = config.port || 3000;
    this.server = http.createServer(this.app);

    this.connectToDatabase();
    this.plugMiddlewares();

    // Plug all business features here
    this.features = new Features(this.app);
    this.features.init();

    this.initSwagger();
    this.handleError();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });

    this.server.on('error', (error: any) => {
      logger.error(error);
      process.exit(1);
    });
  }

  public getServer() {
    return this.server;
  }

  private async connectToDatabase() {
    await dbSource
      .initialize()
      .then(() => {
        logger.info('🟢 The database is connected.');
      })
      .catch(error => {
        logger.error(`🔴 Unable to connect to the database: ${error}.`);
        process.exit(1);
      });
  }

  private plugMiddlewares() {
    this.app.use(morgan(config.logFormat, { stream }));
    this.app.use(cors({ origin: config.origin, credentials: config.credentials }));
    this.app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private handleError() {
    // send back a 404 error for any unknown api request
    this.app.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });
    // other error
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }
}
