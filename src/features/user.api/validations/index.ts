import { password } from '@/utils/validations/custom.validations';
import Joi from 'joi';

/**
 * I am the user validation class.
 *
 * I am responsible to define user http and socket.Io requests validations schemas.
 *
 * I can delegate to Joi to help me with my responsibilities
 */
export default class UserValidation {
  public static create = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
    }),
  };

  public static update = {
    body: Joi.object()
      .keys({
        password: Joi.string().custom(password),
        isEmailVerified: Joi.boolean(),
      })
      .min(1),
  };

  public static find = {
    query: Joi.object().keys({
      email: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
      sortBy: Joi.string(),
    }),
  };

  public static get = {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  };

  public static remove = {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  };

  public static io(object: any): any {
    return Joi.object(object);
  }
}
