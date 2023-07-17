import jwt, { Secret } from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '@config';
import { UserService } from '@features/user/services';
import { Token } from '../entities/token.entity';
import ApiError from '@utils/ApiError';
import { tokenTypes } from '@config/tokens';
import { Container, Service } from 'typedi';
import { dbSource } from '@/database';
import { User } from '@/features/user/entities/user.entity';

@Service()
class TokenService {
  private tokenRepo = dbSource.getRepository(Token);
  public userService = Container.get(UserService);

  public async generateToken(userId: number, expires: Moment, type: string, secret: Secret = config.jwt.secret): Promise<string> {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }

  public async saveToken(token: string, userId: number, expires: Moment, type: string, blacklisted = false): Promise<Token> {
    const tokenDoc = await this.tokenRepo.save({
      user: { id: userId },
      expires: expires.toDate(),
      type,
      token,
      blacklisted,
    });
    return tokenDoc;
  }

  public async verifyToken(token: string, type: string): Promise<Token> {
    const payload: any = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await this.tokenRepo.findOne({
      where: {
        token,
        type,
        user: { id: payload.sub },
        blacklisted: false,
      },
    });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  public async generateAuthTokens(user: User): Promise<{ access: { token: string; expires: Date }; refresh: { token: string; expires: Date } }> {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = await this.generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = await this.generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

    await this.saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  public async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = await this.generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await this.saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  }

  public async generateVerifyEmailToken(user: User): Promise<string> {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = await this.generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await this.saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  }

  public async deleteMany(ids: number[]) {
    return await this.tokenRepo.createQueryBuilder().delete().from(Token).where('id IN (:...ids)', { ids }).execute();
  }

  // user, types,
  public async deleteManyByUserId(userId: number, types: string[]) {
    return await this.tokenRepo
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('user_id = :userId', { userId })
      .andWhere('type IN (:...types)', { types })
      .execute();
  }

  public findOneWhereConditions(options: any) {
    return this.tokenRepo.findOne({
      where: options,
    });
  }

  public deleteOne(data: Token) {
    {
      return this.tokenRepo.remove(data);
    }
  }
}

export default TokenService;
