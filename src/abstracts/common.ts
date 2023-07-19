import { Config } from '@config';
import catchAsync from '@/utils/catchAsync';
import pick from '@/utils/pick';
import { EmailUtils } from '@/utils/services/email';
import { SmsUtils } from '@/utils/services/sms';
import ApiError from '@/utils/ApiError';
import * as dir from '@/utils/dir';
import { logger } from '@/utils/logger';
import * as packageJson from '@/../package.json';

// Data query paginated result type
export type PaginationResult<T> = {
  datas: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

// Data sort type
export type SortByOrder = 'ASC' | 'DESC';

// All utils type
export type Utils = {
  catchAsync: typeof catchAsync;
  pick: typeof pick;
  mail: EmailUtils;
  sms: SmsUtils;
  dir: typeof dir;
  logger: typeof logger;
  packageJson: typeof packageJson;
  ApiError: typeof ApiError;
  config: Config;
};
