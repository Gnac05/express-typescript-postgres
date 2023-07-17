import { Router } from 'express';
import AuthController from '../controllers';
import { IRoutes } from '@interfaces/routes.interface';
import express from 'express';
import * as validator from '../validations';
import validate from '@middlewares/validate';

/**
 * Authentication route.
 */
export class AuthRoute implements IRoutes {
  public path = '/v1/auth';
  public router = Router();
  public auth = new AuthController();
  public app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
    console.log('AuthRoute constructor');
    this.router.post('/register', validate(validator.register), this.auth.register);
    this.router.post('/login', validate(validator.login), this.auth.login);
    this.router.post('/logout', validate(validator.logout), this.auth.logout);
    this.router.post('/refresh-tokens', validate(validator.refreshTokens), this.auth.refreshTokens);
    this.router.post('/forgot-password', validate(validator.forgotPassword), this.auth.forgotPassword);
    this.router.post('/reset-password', validate(validator.resetPassword), this.auth.resetPassword);
    this.router.post('/verify-email', validate(validator.verifyEmail), this.auth.verifyEmail);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
