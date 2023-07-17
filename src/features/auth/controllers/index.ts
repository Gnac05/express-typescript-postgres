import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AuthService from '@/features/auth/services';
import { UserService } from '@/features/user/services';
import TokenService from '../services/token';
import emailService from '@/utils/services/email';
import Container from 'typedi';
import catchAsync from '@/utils/catchAsync';
import { User } from '@/features/user/entities/user.entity';

export default class AuthController {
  public authService = Container.get(AuthService);
  public userService = Container.get(UserService);
  public tokenService = Container.get(TokenService);

  public register = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.create(req.body);
    const tokens = await this.tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  });

  public login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await this.authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await this.tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  });

  public logout = catchAsync(async (req: Request, res: Response) => {
    await this.authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await this.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  });

  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await this.tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.query.token as string, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(req.user as User);
    await emailService.sendVerificationEmail((req.user as User).email as string, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query.token as string);
    res.status(httpStatus.NO_CONTENT).send();
  });
}
