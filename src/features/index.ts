import express from 'express';
import AuthFeature from './auth';
import UserFeature from './user';
import MessageFeature from './message';
import Feature from './base';
import { logger } from '@/utils/logger';

/**
 * Business logics
 */
export default class Features {
  public app: express.Application;
  public featuresLists: Feature[] = [];

  constructor(app: express.Application) {
    this.app = app;
    this.featuresLists.push(new AuthFeature(this.app));
    this.featuresLists.push(new UserFeature(this.app));
    this.featuresLists.push(new MessageFeature(this.app));
  }

  /**
   * Initialize all features
   */
  public init() {
    logger.info('🔄 Features initialization started');
    this.featuresLists.forEach((feature: Feature) => {
      feature.init();
      logger.info(`➔ ${feature?.name} boostraped`);
    });
    logger.info('✅ Features initialization finished');
  }
}
