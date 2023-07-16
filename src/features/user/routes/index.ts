import { Router } from 'express';
import { UserController } from '../controllers';
//import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
//import { ValidationMiddleware } from '@middlewares/validation.middleware';
// Should be replace by the Joi validation
import express from 'express';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public app: express.Application;
  public user = new UserController();

  constructor(app: express.Application) {
    this.app = app;
    this.router.get('', this.user.getUsers);
    this.router.get('/:id', this.user.getUserById);
    this.router.post('', /**ValidationMiddleware(CreateUserDto, 'body'),*/ this.user.createUser);
    this.router.put('/:id', /**ValidationMiddleware(CreateUserDto, 'body', true),*/ this.user.updateUser);
    this.router.delete('/:id', this.user.deleteUser);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
