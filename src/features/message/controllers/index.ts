import { Request, Response } from 'express';
import { Container } from 'typedi';
import catchAsync from '@/utils/catchAsync';
import pick from '@/utils/pick';
import httpStatus from 'http-status';
import { MessageService } from '../services';
import { Message } from '../entities/message.entity';
import { User } from '@/features/user/entities/user.entity';

export class MessageController {
  public service = Container.get(MessageService);

  public find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = pick(req.query, ['title', 'authorId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const datas = await this.service.query(filter, options);
    res.status(httpStatus.OK).send(datas);
  });

  public get = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: Message = await this.service.findById(id);
    res.status(httpStatus.OK).send(data);
  });

  public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userData: Message = req.body;
    //userData.authorId = Number((req.user as User).id);
    const data: Message = await this.service.create(userData);
    res.status(httpStatus.CREATED).send(data);
  });

  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const userData: Message = req.body;
    const data: Message = await this.service.update(id, userData);
    res.status(httpStatus.OK).send(data);
  });

  public remove = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: Message = await this.service.remove(id);
    res.status(httpStatus.OK).send(data);
  });
}
