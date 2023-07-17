import { Service } from 'typedi';
import { Message } from '../entities/message.entity';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status';
import { FindOptions } from 'typeorm';
import { SortByOrder, PaginationResult } from '@interfaces/common';
import { dbSource } from '@/database';

@Service()
export class MessageService {
  private messageRepo = dbSource.getRepository(Message);

  public async findAll(): Promise<Message[]> {
    const messages: Message[] = await this.messageRepo.find();
    return messages;
  }

  public async query<Message>(
    filter: FindOptions,
    options: {
      sortBy?: string;
      limit?: number;
      page?: number;
    },
  ): Promise<PaginationResult<Message>> {
    const { sortBy, limit = 10, page = 1 } = options;

    const queryBuilder = this.messageRepo.createQueryBuilder('message');

    // Apply filters
    if (filter) {
      queryBuilder.where(filter);
    }

    // Apply sorting
    if (sortBy) {
      const sortConditions = sortBy.split(';');
      sortConditions.forEach(sortCondition => {
        const [column, order] = sortCondition.split(':');
        queryBuilder.addOrderBy(`message.${column}`, order.toUpperCase() as SortByOrder);
      });
    }

    // Count total results
    const totalResults = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Get paginated messages
    const datas = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalResults / limit);

    return {
      datas: datas as Message[],
      page,
      limit,
      totalPages,
      totalResults,
    };
  }
  public async findById(id: number): Promise<Message> {
    const data: Message = await this.messageRepo.findOne({ where: { id: id } });
    if (!data) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Message doesn't exist");

    return data;
  }

  public async create(messageData: Message): Promise<Message> {
    const data: Message = await this.messageRepo.save({ ...messageData });
    return data;
  }

  public async update(id: number, messageData: Partial<Message>): Promise<Message> {
    const findMessage: Message = await this.messageRepo.findOne({ where: { id: id } });
    if (!findMessage) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Message doesn't exist");

    await this.messageRepo.update(id, { ...messageData });

    const data: Message = await this.messageRepo.findOne({ where: { id: id } });
    return data;
  }

  public async remove(id: number): Promise<Message> {
    const data: Message = await this.messageRepo.findOne({ where: { id: id } });
    if (!data) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Message doesn't exist");

    await this.messageRepo.delete({ id: id });
    return data;
  }
}
