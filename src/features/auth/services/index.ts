import httpStatus from 'http-status';
import { tokenTypes } from '@config/tokens';
import ApiError from '@utils/ApiError';
import { UserService } from '@/features/user/services';
import TokenService from '../services/token';
import Container, { Service } from 'typedi';
import { User } from '@/features/user/entities/user.entity';

@Service()
export default class AuthService {
  public userService = Container.get(UserService);
  public tokenService = Container.get(TokenService);

  async loginUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  }

  async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await this.tokenService.findOneWhereConditions({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
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
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
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
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
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
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  }
}
