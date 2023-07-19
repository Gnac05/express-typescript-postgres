import { MessageController } from '../controllers';
import MessageValidation from '../validations';
import validate from '@middlewares/validate';
import express from 'express';
import auth from '@middlewares/auth';
import { BaseRoute } from '@/abstracts/route.base';

/**
 * I am a route for the message feature
 *
 * I am responsible for initializing the message feature's routes
 *
 *
 * @extends BaseRoute
 */
export class MessageRoute extends BaseRoute {
  constructor(app: express.Application) {
    super(app, '/v1/messages', MessageController);
    this.router.get('', auth(), validate(MessageValidation.find), this.controller.find);
    this.router.get('/:id', auth(), validate(MessageValidation.get), this.controller.get);
    this.router.post('', auth(), validate(MessageValidation.create), this.controller.create);
    this.router.patch('/:id', auth(), validate(MessageValidation.update), this.controller.update);
    this.router.delete('/:id', auth(), validate(MessageValidation.remove), this.controller.remove);
  }

  public init() {
    this.app.use(this.path, this.router);
  }
}
