import { password } from '@/utils/validations/custom.validations';
import Joi from 'joi';

export const create = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const update = {
  body: Joi.object()
    .keys({
      password: Joi.string().custom(password),
    })
    .min(1),
};

export const find = {
  query: Joi.object().keys({
    email: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

export const get = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

export const remove = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
