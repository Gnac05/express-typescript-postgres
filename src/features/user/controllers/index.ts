import { Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '../services';
import catchAsync from '@/utils/catchAsync';
import pick from '@/utils/pick';
import { User } from '../entities/user.entity';
import httpStatus from 'http-status';

export class UserController {
  public service = Container.get(UserService);

  public find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    console.log('Auth user is: ', req.user);
    const filter = pick(req.query, ['email']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const datas = await this.service.query(filter, options);
    res.status(httpStatus.OK).send(datas);
  });

  public get = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: User = await this.service.findById(id);
    res.status(httpStatus.OK).send(data);
  });

  public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userData: User = req.body;
    const data: User = await this.service.create(userData);
    res.status(httpStatus.CREATED).send(data);
  });

  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const userData: User = req.body;
    const data: User = await this.service.update(id, userData);
    res.status(httpStatus.OK).send(data);
  });

  public remove = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: User = await this.service.remove(id);
    res.status(httpStatus.OK).send(data);
  });
}
