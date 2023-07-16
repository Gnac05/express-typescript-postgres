import express from 'express';
import AuthFeature from './auth';
import UserFeature from './user';
import Feature from './base';

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
  }

  /**
   * Initialize all features
   */
  public init() {
    this.featuresLists.forEach((feature: Feature) => {
      feature.init();
    });
  }
}
