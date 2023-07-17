import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { Schema } from 'joi';

/**
 * Validate request against a Joi schema
 *
 * @param schema Joi.Schema | object - Joi schema to validate against
 *
 * Note: @param schema can be a Joi.Schema or a plain object
 * @returns
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
