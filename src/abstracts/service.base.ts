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
 * I am a base service for a feature
 *
 * Intended to be extended by a feature service
 *@abstract
 */
export abstract class BaseService {
  protected utils: Partial<Utils>;
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
