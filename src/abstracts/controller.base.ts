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
import { Request } from 'express';

/**
 * I am a base controller for a feature
 *
 * Intended to be extended by a feature controller
 *
 * Expose all utils to the controller
 */
export abstract class BaseController {
  protected utils: Utils;
  protected feature?: string;

  constructor(feature?: string) {
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
    this.feature = feature;
  }

  /**
   * Clear the current session and regenerate a new one
   * @param req Express request
   */
  protected clearSession(req: Request, cb: () => void) {
    req.session.user = null;
    req.session.save(function () {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      req.session.regenerate(cb ?? function () {});
    });
  }

  /**
   * Set the session with the given datas
   * @param req Express request
   * @param datas Datas to set on the session
   * @returns void
   */
  protected setSession(req: Request, datas: object) {
    Object.keys(datas).forEach(key => {
      req.session[key] = datas[key];
    });
    req.session.save();
  }
}
