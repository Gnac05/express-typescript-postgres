import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { Schema } from 'joi';

/**
 * Validate request against a Joi schema
 *
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param schema can be a Joi.Schema or a plain object
 * @returns {Function} - Express NextFunction if validation passes, otherwise throws an ApiError
 * @throws {ApiError} - If validation fails, throws an ApiError with httpStatus 400 (Bad Request)
 * @example
 *
 * import validate from '@middlewares/validate';
 * import Joi from 'joi';
 *
 * // Joi schema
 * const schema = Joi.object({
 *      email: Joi.string().email().required(),
 *      password: Joi.string().required(),
 * });
 *
 * // Controller to execute after validation passes
 * const login = (req, res) => {
 *      const { email, password } = req.body;
 *      const user = await authService.login(email, password);
 *      res.send(user);
 * };
 *
 * // Validate against the schema and execute the controller after validation passes
 * router.post('/login', validate(schema), login);
 */
const validate = (schema: Schema | object) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'files', 'file']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
