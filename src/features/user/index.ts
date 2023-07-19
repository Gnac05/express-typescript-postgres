import Feature from '../../abstracts/feature.base';
import express from 'express';
import { UserRoute } from './routes';

/**
 * I am a feature for the user feature
 *
 * I am responsible for initializing the user feature
 *
 * I can delegate to routes to help me with my responsibilities
 * @extends Feature
 */
export default class UserFeature extends Feature {
  /** User routes */
  public routes: UserRoute;

  constructor(app: express.Application) {
    super(app, 'User', 'User feature');
    this.routes = new UserRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
