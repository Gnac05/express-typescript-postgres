import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Load the environment variables from the .env file depending on the NODE_ENV
dotenv.config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}.local`) });

/**
 * I am the application configuration container.
 *
 * I am a singleton.
 *
 * I'm exported as a singleton instance, so that all modules share the same configuration.
 *
 * No need to create an instance of me, just import me and use me.
 *
 * @example
 *
 * import config from 'path/to/config';
 *
 * console.log(config.port); // 3000
 *
 * @class Config
 * @singleton
 * @since 1.0.0
 */
export class Config {
  /** Singleton instance */
  private static instance: Config;

  /** Environment variables */
  public env: string;
  /** Whether the application is in production or not */
  public isProduction: boolean;
  /** Whether the application is in development or not */
  public port: number;

  /** The frontend app url (Used for password reset) */
  public frontendUrl: string;
  /** Project code name */
  public projectName: string;
  /** Project display name */
  public projectDisplayName: string;
  /** Project description */
  public projectDescription: string;

  /** Where to store log file */
  public logDir: string;
  /** Log format */
  public logFormat: string;

  /** CORS origin */
  public origin: string;
  /** CORS credentials */
  public credentials: boolean;

  /** General secret used for general purpose */
  public secretKey: string;
  /** JWT access token expiration in minutes */
  public jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  };

  /** Database configuration vars */
  public db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };

  /** An url based version of the db connection (user, passhort, port) */
  public get dbUrl(): string {
    return `postgres://${this.db.user}:${this.db.password}@${this.db.host}:${this.db.port}/${this.db.database}`;
  }

  /** Email sending configurations */
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

  /** SMS sending configurations */
  public sms: {
    twilio: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
  };

  private constructor() {
    /** Joi Schema to validate the env vars */
    const envVarsSchema = Joi.object()
      .keys({
        // PROJECT
        PROJECT_NAME: Joi.string().required().description('Project code name (no spacial chars, no spaces)'),
        PROJECT_DISPLAY_NAME: Joi.string().required().description('Project display name'),
        PROJECT_DESCRIPTION: Joi.string().required().description('Project description'),
        FRONTEND_URL: Joi.string().required().description('Frontend app url, used for password reset'),

        // NODE
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        SECRET_KEY: Joi.string().required().description('General purpose secret key. Not widely used.'),
        LOG_FORMAT: Joi.string().required().description('Log format'),
        LOG_DIR: Joi.string().required().description('Log directory'),
        PORT: Joi.number().default(3000).description('Port number to run the server on'),

        // DB
        DB_HOST: Joi.string().required().description('Postgres database host name'),
        DB_PORT: Joi.number().default(5432).description('Postgres database port'),
        DB_USER: Joi.string().required().description('Postgres database user'),
        DB_PASSWORD: Joi.string().required().description('Postgres database password'),
        DB_DATABASE: Joi.string().required().description('Postgres database name'),

        // CORS
        ORIGIN: Joi.string().required().description('CORS origin'),
        CREDENTIALS: Joi.boolean().default(false).description('CORS credentials'),

        // JWT
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('Minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Days after which refresh tokens expire'),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('Minutes after which reset password token expires'),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('Minutes after which verify email token expires'),

        // EMAIL
        SMTP_HOST: Joi.string().description('Server that will send the emails'),
        SMTP_PORT: Joi.number().description('Port to connect to the email server'),
        SMTP_USERNAME: Joi.string().description('Username for email server'),
        SMTP_PASSWORD: Joi.string().description('Password for email server'),
        EMAIL_FROM: Joi.string().description('The from field in the emails sent by the app'),

        // twilio
        TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account SID'),
        TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
        TWILIO_PHONE_NUMBER: Joi.string().description('Twilio phone number'),
      })
      .unknown();

    // Validate env vars
    const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' }, abortEarly: true }).validate(process.env);

    // Throw error if env vars are not valid
    if (error) {
      // console.log(error);
      // process.exit(1);
    }

    // If we are here, then the env vars are valid
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

  /**
   * Get the singleton instance of the Config class
   * @returns {Config} The singleton instance
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config.getInstance();
