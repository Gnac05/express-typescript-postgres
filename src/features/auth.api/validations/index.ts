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
}
