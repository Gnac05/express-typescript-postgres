import Joi from 'joi';

/**
 * I am the message validation class.
 *
 * I am responsible to define message http and socket.Io requests validations schemas.
 *
 * I can delegate to Joi to help me with my responsibilities
 */
export default class MessageValidation {
  public static create = {
    body: Joi.object().keys({
      title: Joi.string().required(),
      content: Joi.string().required(),
      thumbnail: Joi.any(),
      isArchived: Joi.boolean(),
      author: Joi.number().integer().required(),
    }),
  };

  public static update = {
    body: Joi.object()
      .keys({
        title: Joi.string(),
        content: Joi.string(),
        author: Joi.number().integer(),
        thumbnail: Joi.any(),
        isArchived: Joi.boolean(),
      })
      .min(1),
  };

  public static find = {
    query: Joi.object().keys({
      title: Joi.string(),
      author: Joi.number().integer(),
      isArchived: Joi.boolean(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
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

  public static ioCreate = this.io(this.create);
  public static ioUpdate = this.io(this.update);
  public static ioFind = this.io(this.find);
  public static ioGet = this.io(this.get);
  public static ioRemove = this.io(this.remove);
}
