import httpStatus from 'http-status';
import { tokenTypes } from '@config/tokens';
import { UserService } from '@/features/user.api/services';
import TokenService from './token';
import Container, { Service } from 'typedi';
import { User } from '@/features/user.api/entities/user.entity';
import { BaseService } from '@/abstracts/service.base';

/**
 * I am the auth service.
 *
 * I am responsible for handling all the business logic related to authentication.
 *
 * I can delegate to other services to help me with my responsibilities.
 */
@Service()
export default class AuthService extends BaseService {
  public userService = Container.get(UserService);
  public tokenService = Container.get(TokenService);

  async loginUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new this.utils.ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  }

  async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await this.tokenService.findOneWhereConditions({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new this.utils.ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await this.tokenService.deleteOne(refreshTokenDoc);
  }

  async refreshAuth(refreshToken: string): Promise<Object> {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await this.userService.findById(refreshTokenDoc.user.id);
      if (!user) {
        throw new Error();
      }
      await this.tokenService.deleteOne(refreshTokenDoc);
      return this.tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new this.utils.ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  }

  async resetPassword(resetPasswordToken: string, newPassword: string): Promise<void> {
    try {
      const resetPasswordTokenDoc = await this.tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = await this.userService.findById(resetPasswordTokenDoc.user.id);
      if (!user) {
        throw new Error();
      }
      await this.userService.update(user.id, { password: newPassword } as User);
      await this.tokenService.deleteManyByUserId(user.id, [tokenTypes.RESET_PASSWORD]);
    } catch (error) {
      throw new this.utils.ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  }

  async verifyEmail(verifyEmailToken: string): Promise<void> {
    try {
      const verifyEmailTokenDoc = await this.tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
      const user = await this.userService.findById(verifyEmailTokenDoc.user.id);
      if (!user) {
        throw new Error();
      }
      await this.tokenService.deleteManyByUserId(user.id, [tokenTypes.VERIFY_EMAIL]);
      await this.userService.update(user.id, { isEmailVerified: true });
    } catch (error) {
      throw new this.utils.ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  }
}
