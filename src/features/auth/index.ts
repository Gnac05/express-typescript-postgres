import Feature from '../base';
import { AuthRoute } from './routes';
import express from 'express';

export default class AuthFeature extends Feature {
  public routes: AuthRoute;

  constructor(app: express.Application) {
    super(app);
    this.name = 'Auth';
    this.description = 'Auth feature';
    this.routes = new AuthRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
