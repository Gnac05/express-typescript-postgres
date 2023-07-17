import Feature from '../base';
import express from 'express';
import { MessageRoute } from './routes';

export default class MessageFeature extends Feature {
  public routes: MessageRoute;

  constructor(app: express.Application) {
    super(app);
    this.name = 'Message';
    this.description = 'Message feature';
    this.routes = new MessageRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
