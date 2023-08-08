import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BaseController } from '@/abstracts/controller.base';
import { UserService } from '@/features/user.api/services';
import TokenService from '@/features/auth.api/services/token';
import { Container } from 'typedi';
import emailService from '@/utils/services/email';
import { User } from '@/features/user.api/entities/user.entity';
import moment from 'moment';
import config from '@/config';
import { tokenTypes } from '@/config/tokens';

/**
 * I am a controller for the user feature
 *
 * I am responsible for handling requests for the user feature
 *
 * I can delegate to services to help me with my responsibilities
 *
 */
export class AuthPagesController extends BaseController {
  private viewDir: string;
  constructor() {
    super('auth.pages');
    this.viewDir = this.feature;
  }

  public userService = Container.get(UserService);
  public tokenService = Container.get(TokenService);

  public register = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/register');
  });

  public handleRegister = this.utils.catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.render(this.viewDir + '/register', { message: 'Please provide an email and password' });
    }
    await this.userService.create({ email, password } as User);
    res.redirect('/auth/login');
  });

  public login = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/login');
  });

  public handleLogin = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      res.render(this.viewDir + '/login', { message: 'Incorrect email or password' });
    }

    this.setSession(req, { user: user, isAuth: true });

    res.redirect('/dashboard');
  });

  public logout = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    this.clearSession(req, () => {
      res.redirect('/auth/login');
    });
  });

  public forgotPassword = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    res.status(httpStatus.OK).render(this.viewDir + '/forgot-password');
  });

  public handleForgotPassword = this.utils.catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      res.render(this.viewDir + '/forgot-password', { message: 'No user found with this email' });
    }

    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = await this.tokenService.generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await this.tokenService.saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    await emailService.sendResetPasswordEmail(user.email, resetPasswordToken);
    res.status(httpStatus.OK).render(this.viewDir + '/forgot-password', { message: 'An email has been sent to your email address' });
  });

  public resetPassword = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const token = req.query.token as string;
    res.status(httpStatus.OK).render(this.viewDir + '/reset-password', { token: token });
  });

  public handleResetPassword = this.utils.catchAsync(async (req: Request, res: Response) => {
    const { password } = req.body;
    const token = req.query.token as string;

    const resetPasswordTokenDoc = await this.tokenService.verifyToken(token, tokenTypes.RESET_PASSWORD);
    const user = await this.userService.findById(resetPasswordTokenDoc.user.id);

    if (!user) {
      res.render(this.viewDir + '/reset-password', { message: 'Invalid token or unknown user' });
    }

    await this.userService.update(user.id, { password } as User);
    await this.tokenService.deleteManyByUserId(user.id, [tokenTypes.RESET_PASSWORD]);
  });

  public sendVerificationEmail = this.utils.catchAsync(async (req: Request, res: Response) => {
    const user = req.session.user as User;
    const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email as string, verifyEmailToken);
    res.status(httpStatus.OK).render(this.viewDir + '/send-verification-email', { message: 'An email has been sent to your email address' });
  });

  public verifyEmail = this.utils.catchAsync(async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const verifyEmailTokenDoc = await this.tokenService.verifyToken(token, tokenTypes.VERIFY_EMAIL);
    const user = await this.userService.findById(verifyEmailTokenDoc.user.id);
    if (!user) {
      res.render(this.viewDir + '/verify-email', { message: 'Invalid token or unknown user' });
    }
    await this.tokenService.deleteManyByUserId(user.id, [tokenTypes.VERIFY_EMAIL]);
    await this.userService.update(user.id, { isEmailVerified: true });

    res.redirect('/dashboard');
  });
}
