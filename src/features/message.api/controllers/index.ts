import { Request, Response } from 'express';
import { Container } from 'typedi';
import httpStatus from 'http-status';
import { MessageService } from '../services';
import { Message } from '../entities/message.entity';
import { BaseController } from '@/abstracts/controller.base';
import { User } from '@/features/user.api/entities/user.entity';

/**
 * I am a controller for the message feature
 *
 * I am responsible for handling requests for the message feature
 *
 * I can delegate to services to help me with my responsibilities
 *
 */
export class MessageController extends BaseController {
  public service = Container.get(MessageService);

  public find = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = this.utils.pick(req.query, ['title', 'author', 'createdAt', 'updatedAt', 'isArchived']);
    const options = this.utils.pick(req.query, ['sortBy', 'limit', 'page']);
    const datas = await this.service.query(filter, options);
    res.status(httpStatus.OK).send(datas);
  });

  public get = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: Message = await this.service.findById(id);
    res.status(httpStatus.OK).send(data);
  });

  public create = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userData: Message = req.body;
    userData.author = Number((req.user as User).id);
    const data: Message = await this.service.create(userData);
    res.status(httpStatus.CREATED).send(data);
  });

  public update = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const userData: Message = req.body;
    const data: Message = await this.service.update(id, userData);
    res.status(httpStatus.OK).send(data);
  });

  public remove = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const data: Message = await this.service.remove(id);
    res.status(httpStatus.OK).send(data);
  });
}
