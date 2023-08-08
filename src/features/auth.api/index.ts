import Feature from '../../abstracts/feature.base';
import { AuthRoute } from './routes';
import express from 'express';

/**
 * I am a feature for the auth feature
 *
 * I am responsible for initializing the auth feature
 *
 * I can delegate to routes to help me with my responsibilities
 * @extends Feature
 */
export default class AuthFeature extends Feature {
  public routes: AuthRoute;

  constructor(app: express.Application) {
    super(app, 'Auth', 'Auth feature');
    this.routes = new AuthRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
