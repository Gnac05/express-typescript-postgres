import { Router } from 'express';
import { UserController } from '../controllers';
import { IRoutes } from '@interfaces/routes.interface';
import * as validator from '../validations';
import validate from '@middlewares/validate';
import express from 'express';
import auth from '@middlewares/auth';

export class UserRoute implements IRoutes {
  public path = '/v1/users';
  public router = Router();
  public app: express.Application;
  public user = new UserController();

  constructor(app: express.Application) {
    this.app = app;
    this.router.get('', auth(), validate(validator.find), this.user.find);
    this.router.get('/:id', auth(), validate(validator.get), this.user.get);
    this.router.post('', validate(validator.create), this.user.create);
    this.router.patch('/:id', auth(), validate(validator.update), this.user.update);
    this.router.delete('/:id', auth(), validate(validator.remove), this.user.remove);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
