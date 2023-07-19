import express from 'express';

/**
 * I am the base feature for a feature
 *
 * Intended to be extended by a feature
 *
 * @abstract
 */
export default abstract class Feature {
  /** Express application */
  public app: express.Application;
  /** Name of the feature */
  public name?: string;
  /** Description of the feature */
  public description?: string;

  constructor(app, name?: string, description?: string) {
    this.app = app;
    this.name = name;
    this.description = description;
  }

  /**
   * Initialize the feature (routes,controllers,etc)
   * @returns void
   */
  public abstract init(): void;
}
