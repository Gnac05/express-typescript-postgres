import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BaseController } from '@/abstracts/controller.base';

/**
 * I am a controller for the user feature
 *
 * I am responsible for handling requests for the user feature
 *
 * I can delegate to services to help me with my responsibilities
 *
 */
export class HomePagesController extends BaseController {
  private viewDir: string;
  constructor() {
    super('home.pages');
    this.viewDir = this.feature;
  }

  public home = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/index');
  });

  public about = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/about');
  });

  public contact = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/contact');
  });

  public login = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/login');
  });

  public register = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/register');
  });
}
