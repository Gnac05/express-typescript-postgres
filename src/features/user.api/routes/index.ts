import { UserController } from '../controllers';
import UserValidation from '../validations';
import validate from '@middlewares/validate';
import express from 'express';
import auth from '@middlewares/auth';
import { BaseRoute } from '@/abstracts/route.base';

/**
 * I am a route for the user feature
 *
 * I am responsible for initializing the user feature's routes
 *
 *
 * @extends BaseRoute
 */
export class UserRoute extends BaseRoute {
  constructor(app: express.Application) {
    super(app, '/v1/users', UserController);
    this.router.get('', auth(), validate(UserValidation.find), this.controller.find);
    this.router.get('/:id', auth(), validate(UserValidation.get), this.controller.get);
    this.router.post('', auth(), validate(UserValidation.create), this.controller.create);
    this.router.patch('/:id', auth(), validate(UserValidation.update), this.controller.update);
    this.router.delete('/:id', auth(), validate(UserValidation.remove), this.controller.remove);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
