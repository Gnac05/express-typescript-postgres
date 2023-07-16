import { Router } from 'express';
import { AuthController } from '../controllers';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import express from 'express';

/**
 * Authentication route.
 */
export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();
  public app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
    this.router.post('/signup', /* ValidationMiddleware(CreateUserDto, 'body'), */ this.auth.signUp);
    this.router.post('/login', /* ValidationMiddleware(CreateUserDto, 'body'), */ this.auth.logIn);
    this.router.post('/logout', AuthMiddleware, this.auth.logOut);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
