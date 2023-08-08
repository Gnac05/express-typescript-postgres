import express from 'express';
import Feature from '../abstracts/feature.base';
import { logger } from '@/utils/logger';
// API Features
import AuthFeature from './auth.api';
import UserFeature from './user.api';
import MessageFeature from './message.api';
// Web Features
import HomePagesFeature from './home.pages';

/**
 * I am the Features class.
 *
 * I contain all the business features of the application.
 *
 * I'm responsible for initializing all features by giving them the express application
 * and calling their init() method.
 */
export default class Features {
  /** The express application */
  public app: express.Application;
  /** Business features container */
  public featuresLists: Feature[] = [];

  constructor(app: express.Application) {
    this.app = app;
    this.featuresLists.push(new HomePagesFeature(this.app));
    this.featuresLists.push(new AuthFeature(this.app));
    this.featuresLists.push(new UserFeature(this.app));
    this.featuresLists.push(new MessageFeature(this.app));
  }

  /**
   * Initialize all features
   *
   * @returns void
   */
  public init() {
    logger.info('🔄 Features initialization started');
    this.featuresLists.forEach((feature: Feature) => {
      feature.init();
      logger.info(`➔ Feature: #${feature?.name} boostraped`);
    });
    logger.info('✅ Features initialization finished');
  }
}
