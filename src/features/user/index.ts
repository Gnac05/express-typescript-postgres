import Feature from '../base';
import express from 'express';
import { UserRoute } from './routes';

export default class UserFeature extends Feature {
  public routes: UserRoute;

  constructor(app: express.Application) {
    super(app);
    this.name = 'User';
    this.description = 'User feature';
    this.routes = new UserRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
