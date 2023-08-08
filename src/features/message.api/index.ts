import Feature from '../../abstracts/feature.base';
import express from 'express';
import { MessageRoute } from './routes';

/**
 * I am a feature for the message feature
 *
 * I am responsible for initializing the message feature
 *
 * I can delegate to routes to help me with my responsibilities
 * @extends Feature
 */
export default class MessageFeature extends Feature {
  public routes: MessageRoute;

  constructor(app: express.Application) {
    super(app, 'Message', 'Message feature');
    this.routes = new MessageRoute(this.app);
  }

  public init(): void {
    this.routes.init();
  }
}
