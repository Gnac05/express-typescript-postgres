import { Router } from 'express';
import express from 'express';

/**
 * I am a base route for a feature
 *
 * Intended to be extended by a feature route
 *
 * @abstract
 */
export abstract class BaseRoute {
  /** Base route for this feature route */
  public path: string;
  /** Express router */
  public router = Router();
  /** Express application */
  public app: express.Application;
  /** Controller for this feature route */
  public controller: any;

  constructor(app: express.Application, path: string, Controller: any) {
    this.app = app;
    this.path = path;
    this.controller = new Controller();
  }

  /**
   * Initialize the route
   * @returns void
   */
  public abstract init();
}
