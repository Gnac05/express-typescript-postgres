import config from '@config';
import catchAsync from '@/utils/catchAsync';
import pick from '@/utils/pick';
import mail from '@/utils/services/email';
import sms from '@/utils/services/sms';
import ApiError from '@/utils/ApiError';
import * as dir from '@/utils/dir';
import { logger } from '@/utils/logger';
import * as packageJson from '@/../package.json';
import { Utils } from '@/abstracts/common';

/**
 * I am a base controller for a feature
 *
 * Intended to be extended by a feature controller
 *
 * Expose all utils to the controller
 */
export abstract class BaseController {
  protected utils: Utils;

  constructor() {
    this.utils = {
      catchAsync,
      pick,
      mail,
      sms,
      dir,
      logger,
      packageJson,
      ApiError,
      config,
    };
  }
}
