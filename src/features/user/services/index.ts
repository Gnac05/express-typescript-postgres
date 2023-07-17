import { Service } from 'typedi';
import { User } from '../entities/user.entity';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status';
import { FindOptions } from 'typeorm';
import { SortByOrder, PaginationResult } from '@interfaces/common';
import { dbSource } from '@/database';

@Service()
export class UserService {
  private repo = dbSource.getRepository(User);

  public async findAll(): Promise<User[]> {
    const users: User[] = await this.repo.find();
    return users;
  }

  public async query<User>(
    filter: FindOptions,
    options: {
      sortBy?: string;
      limit?: number;
      page?: number;
    },
  ): Promise<PaginationResult<User>> {
    const { sortBy, limit = 10, page = 1 } = options;

    const queryBuilder = this.repo.createQueryBuilder('user');

    // Apply filters
    if (filter) {
      queryBuilder.where(filter);
    }

    // Apply sorting
    if (sortBy) {
      const sortConditions = sortBy.split(';');
      sortConditions.forEach(sortCondition => {
        const [column, order] = sortCondition.split(':');
        queryBuilder.addOrderBy(`user.${column}`, order.toUpperCase() as SortByOrder);
      });
    }

    // Count total results
    const totalResults = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Get paginated users
    const datas = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalResults / limit);

    return {
      datas: datas as User[],
      page,
      limit,
      totalPages,
      totalResults,
    };
  }
  public async findById(id: number): Promise<User> {
    const data: User = await this.repo.findOne({ where: { id: id } });
    if (!data) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User doesn't exist");

    return data;
  }

  public async findByEmail(email: string): Promise<User> {
    const data: User = await this.repo.findOne({ where: { email } });
    if (!data) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User doesn't exist");

    return data;
  }

  public async create(userData: User): Promise<User> {
    const data: User = await this.repo.findOne({ where: { email: userData.email } });

    if (data) throw new ApiError(httpStatus.BAD_REQUEST, `This email ${userData.email} already exists`);

    const createUserData: User = await this.repo.save({ ...userData });

    return createUserData;
  }

  public async update(id: number, userData: Partial<User>): Promise<User> {
    const findUser: User = await this.repo.findOne({ where: { id: id } });
    if (!findUser) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User doesn't exist");

    await this.repo.update(id, { ...userData });

    const data: User = await this.repo.findOne({ where: { id: id } });
    return data;
  }

  public async remove(id: number): Promise<User> {
    const data: User = await this.repo.findOne({ where: { id: id } });
    if (!data) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User doesn't exist");

    await this.repo.delete({ id: id });
    return data;
  }
}
