import * as express from 'express';
import { NODE_ENV } from '@config';

export default abstract class Feature {
  public app: express.Application;
  public name?: string;
  public description?: string;
  public env: string;
  constructor(app) {
    this.app = app;
    this.env = NODE_ENV || 'development';
  }

  /**
   * Boostrap the features by inject :
   *
   * - it routing
   * - it middlewares
   * - it controller
   * - and so on
   */
  public abstract init(): void;
}
