import Feature from '../../abstracts/feature.base';
import express from 'express';
import { HomePagesRoute } from './routes';

/**
 * I am a feature for the home's pages
 *
 * I am responsible for serving web pages to visitors
 *
 * I can delegate to routes to help me with my responsibilities
 * @extends Feature
 */
export default class HomePagesFeature extends Feature {
  /** User routes */
  public routes: HomePagesRoute;

  constructor(app: express.Application) {
    super(app, 'HomePages', 'Home pages feature');
    this.routes = new HomePagesRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
