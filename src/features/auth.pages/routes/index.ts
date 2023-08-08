import { AuthPagesController } from '../controllers';
import express from 'express';
import { BaseRoute } from '@/abstracts/route.base';

/**
 * I am a route for the home feature
 *
 * I am view oriented feature's route
 *
 * I am responsible for serving web pages to visitors
 *
 *
 * @extends BaseRoute
 */
export class AuthPagesRoute extends BaseRoute {
  constructor(app: express.Application) {
    super(app, '', AuthPagesController);
    /**
     * Login,
     * Register,
     * Forgot password,
     * Reset password,
     * Verify email
     *
     */
    this.router.get('', this.controller.home);
    this.router.get('/about', this.controller.about);
    this.router.get('/contact', this.controller.contact);
    this.router.get('/login', this.controller.login);
    this.router.get('/register', this.controller.register);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
