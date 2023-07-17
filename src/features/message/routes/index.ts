import { Router } from 'express';
import { MessageController } from '../controllers';
import { IRoutes } from '@interfaces/routes.interface';
import * as validator from '../validations';
import validate from '@middlewares/validate';
import express from 'express';
import auth from '@middlewares/auth';

export class MessageRoute implements IRoutes {
  public path = '/v1/messages';
  public router = Router();
  public app: express.Application;
  public message = new MessageController();

  constructor(app: express.Application) {
    this.app = app;
    this.router.get('', auth(), validate(validator.find), this.message.find);
    this.router.get('/:id', auth(), validate(validator.get), this.message.get);
    this.router.post('', validate(validator.create), this.message.create);
    this.router.patch('/:id', auth(), validate(validator.update), this.message.update);
    this.router.delete('/:id', auth(), validate(validator.remove), this.message.remove);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
