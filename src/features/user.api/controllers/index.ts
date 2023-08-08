import { Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '../services';
import { User } from '../entities/user.entity';
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
export class UserController extends BaseController {
  /** User service */
  public service = Container.get(UserService);

  public find = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = this.utils.pick(req.query, ['email']);
    const options = this.utils.pick(req.query, ['sortBy', 'limit', 'page']);
    const datas = await this.service.query(filter, options);
    res.status(httpStatus.OK).send(datas);
  });

  public get = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: User = await this.service.findById(id);
    res.status(httpStatus.OK).send(data);
  });

  public create = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userData: User = req.body;
    const data: User = await this.service.create(userData);
    res.status(httpStatus.CREATED).send(data);
  });

  public update = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const userData: User = req.body;
    const data: User = await this.service.update(id, userData);
    res.status(httpStatus.OK).send(data);
  });

  public remove = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: User = await this.service.remove(id);
    res.status(httpStatus.OK).send(data);
  });
}
