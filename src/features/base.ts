import * as express from 'express';
import { NODE_ENV } from '@config';
import email from '@/utils/services/email';
import sms from '@/utils/services/sms';
export default abstract class Feature {
  public app: express.Application;
  public name?: string;
  public description?: string;
  public env: string;
  public utils: {
    email: typeof email;
    sms: typeof sms;
  };

  constructor(app) {
    this.app = app;
    this.env = NODE_ENV || 'development';
    this.utils = {
      email,
      sms,
    };
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
