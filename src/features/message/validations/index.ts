import Joi from 'joi';

export const create = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    comments: Joi.array().items(
      Joi.object().keys({
        email: Joi.string().required(),
        content: Joi.string(),
      }),
    ),
  }),
};

export const update = {
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
      comments: Joi.array().items(
        Joi.object()
          .keys({
            email: Joi.string(),
            content: Joi.string(),
          })
          .min(1),
      ),
    })
    .min(1),
};

export const find = {
  query: Joi.object().keys({
    title: Joi.string(),
    authorId: Joi.number().integer(),
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
