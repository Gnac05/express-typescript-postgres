import { password } from '@/utils/validations/custom.validations';
import Joi from 'joi';

/**
 * I am the auth validation class.
 *
 * I am responsible to define auth http and socket.Io requests validations schemas.
 *
 * I can delegate to Joi to help me with my responsibilities
 */
export default class AuthValidation {
  public static login = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
    }),
  };

  public static register = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
    }),
  };

  public static logout = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  };

  public static refreshTokens = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  };

  public static forgotPassword = {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  };

  public static resetPassword = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
    body: Joi.object().keys({
      password: Joi.string().required().custom(password),
    }),
  };

  public static verifyEmail = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
  };

  public static io(object: any): any {
    return Joi.object(object);
  }

  public static ioLogin = this.io(this.login);
  public static ioRegister = this.io(this.register);
  public static ioLogout = this.io(this.logout);
  public static ioRefreshTokens = this.io(this.refreshTokens);
  public static ioForgotPassword = this.io(this.forgotPassword);
  public static ioResetPassword = this.io(this.resetPassword);
  public static ioVerifyEmail = this.io(this.verifyEmail);
}
