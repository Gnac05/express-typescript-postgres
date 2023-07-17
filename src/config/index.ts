import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;

import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}.local`) });

class Config {
  private static instance: Config;

  public env: string;
  public isProduction: boolean;
  public port: number;
  public logDir: string;
  public logFormat: string;
  public origin: string;
  public credentials: boolean;
  public secretKey: string;
  public frontendUrl: string;
  public projectName: string;
  public projectDisplayName: string;
  public projectDescription: string;
  public db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  public jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  };
  public email: {
    smtp: {
      host: string;
      port: number;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };

  public sms: {
    twilio: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
  };

  private constructor() {
    const envVarsSchema = Joi.object()
      .keys({
        // PROJECT
        PROJECT_NAME: Joi.string().required().description('Project name'),
        PROJECT_DISPLAY_NAME: Joi.string().required().description('Project display name'),
        PROJECT_DESCRIPTION: Joi.string().required().description('Project description'),
        FRONTEND_URL: Joi.string().required().description('Frontend url'),

        // NODE
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        SECRET_KEY: Joi.string().required().description('JWT secret key'),
        LOG_FORMAT: Joi.string().required().description('Log format'),
        LOG_DIR: Joi.string().required().description('Log directory'),
        PORT: Joi.number().default(3000),

        // DB
        DB_HOST: Joi.string().required().description('Postgres database host name'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required().description('Postgres database user'),
        DB_PASSWORD: Joi.string().required().description('Postgres database password'),
        DB_DATABASE: Joi.string().required().description('Postgres database name'),

        // CORS
        ORIGIN: Joi.string().required().description('Origin'),
        CREDENTIALS: Joi.boolean().default(false).description('Credentials'),

        // JWT
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which verify email token expires'),

        // EMAIL
        SMTP_HOST: Joi.string().description('server that will send the emails'),
        SMTP_PORT: Joi.number().description('port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('username for email server'),
        SMTP_PASSWORD: Joi.string().description('password for email server'),
        EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

        // twilio
        TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account SID'),
        TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
        TWILIO_PHONE_NUMBER: Joi.string().description('Twilio phone number'),
      })
      .unknown();

    const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    this.env = envVars.NODE_ENV;
    this.isProduction = envVars.NODE_ENV === 'production';
    this.port = envVars.PORT;
    this.db = {
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_DATABASE,
    };
    this.secretKey = envVars.SECRET_KEY;
    this.logDir = envVars.LOG_DIR;
    this.logFormat = envVars.LOG_FORMAT;
    this.origin = envVars.ORIGIN;
    this.credentials = envVars.CREDENTIALS === 'true';
    this.frontendUrl = envVars.FRONTEND_URL;
    this.projectName = envVars.PROJECT_NAME;
    this.projectDisplayName = envVars.PROJECT_DISPLAY_NAME;
    this.projectDescription = envVars.PROJECT_DESCRIPTION;
    this.jwt = {
      secret: envVars.JWT_SECRET,
      accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    };
    this.email = {
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        auth: {
          user: envVars.SMTP_USERNAME,
          pass: envVars.SMTP_PASSWORD,
        },
      },
      from: envVars.EMAIL_FROM,
    };

    this.sms = {
      twilio: {
        accountSid: envVars.TWILIO_ACCOUNT_SID,
        authToken: envVars.TWILIO_AUTH_TOKEN,
        phoneNumber: envVars.TWILIO_PHONE_NUMBER,
      },
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config.getInstance();
