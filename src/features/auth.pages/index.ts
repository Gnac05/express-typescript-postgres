import Feature from '../../abstracts/feature.base';
import express from 'express';
import { AuthPagesRoute } from './routes';

/**
 * I am a feature for the home's pages
 *
 * I am responsible for serving web pages to visitors
 *
 * I can delegate to routes to help me with my responsibilities
 * @extends Feature
 */
export default class AuthPagesFeature extends Feature {
  /** User routes */
  public routes: AuthPagesRoute;

  constructor(app: express.Application) {
    super(app, 'AuthPages', 'Auth pages feature');
    this.routes = new AuthPagesRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
