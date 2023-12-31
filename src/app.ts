import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
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
import path from 'path';

// express session and connect-pg-simple
import session from 'express-session';
import pgSession from 'connect-pg-simple';

export class App {
  /** Express Application */
  public app: express.Application;
  /** Environment */
  public env: string;
  /** Port */
  public port: string | number;
  /** Features (Business Logics and functionalities) */
  public features: Features;
  /** Server */
  public server: http.Server;

  constructor() {
    this.app = express();
    this.env = config.env || 'development';
    this.port = config.port || 3000;
    this.server = http.createServer(this.app);

    // Connect to the database
    this.connectToDatabase();

    // Plug all middlewares needed before routes
    this.plugExpressSession();
    this.plugMiddlewares();

    // Plug all business features here
    this.features = new Features(this.app);
    this.features.init();

    // Plug error handling middleware
    this.handleError();
    // Plug swagger documentation middleware
    this.initSwagger();
  }

  /**
   * Starts the server and on error gracefully exits the process
   *
   * @returns void
   */
  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`🚀 App Started in ENV: ${this.env} on  PORT: ${this.port}`);
    });

    this.server.on('error', async (error: any) => {
      logger.error('Listen: ', error);
      await this.gracefulShutdown();
    });
  }

  /**
   * Gracefully shutdown the server
   *
   * @returns Promise<void>
   */
  public async gracefulShutdown() {
    // Close the database connection
    await dbSource.destroy();

    // Close the server
    this.server.close(() => {
      logger.info('🔴 Server is gracefully terminated.');
      process.exit(0);
    });
  }

  /**
   * Plug express session
   */
  private plugExpressSession() {
    const pgSessionStore = pgSession(session);
    const pgSessionStoreInstance = new pgSessionStore({
      conString: config.dbUrl,
      tableName: 'application-session',
      createTableIfMissing: true,
    });

    this.app.use(
      session({
        store: pgSessionStoreInstance,
        secret: config.secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          httpOnly: true,
          secure: false,
        },
      }),
    );
  }

  /**
   * Connects to the database
   *
   * @returns Promise<void>
   */
  private async connectToDatabase() {
    return await dbSource
      .initialize()
      .then(() => {
        logger.info('🟢 The database is connected.');
      })
      .catch(async error => {
        logger.error(`🔴 Unable to connect to the database: ${error}.`);
        await this.gracefulShutdown();
      });
  }

  /**
   * Plug all middlewares needed before routes
   *
   * @returns void
   */
  private plugMiddlewares() {
    this.app.use(express.static(path.join(__dirname + '/../public')));
    this.app.set('view engine', 'pug');
    this.app.set('views', [path.join(__dirname, '/views')]);
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

  /**
   * Plug swagger documentation middleware
   *
   * @returns void
   */
  private initSwagger() {
    // @TODO: Add swagger documentation
  }

  /**
   * Plug error handling middleware
   *
   * @returns void
   */
  private handleError() {
    this.app.use((req, res, next) => {
      if (req.path.match(/\/v[0-9]+/)) {
        next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
      } else {
        return res.status(404).render('404');
      }
    });

    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }
}
