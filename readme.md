# RESTful API & Website w/ Typescript+Postgres+Express Boilerplate

>
>
> Express + TypeScript + TypeORM + PostgreSQL ╰┈➤ Boilerplate/starter project for quickly building RESTful APIs and website.
>
>

:warning: **Some task are in progress: [See theme here](todo.md).**
## Quick Start

Clone the repo:

```bash
# clone the repo
git clone --depth 1 https://github.com/Dahkenangnon/express-typescript-postgres

# move to the project folder
cd express-typescript-postgres

# remove current origin repository
npx rimraf ./.git
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env.development.local

# open .env.development.local and modify the environment variables (if needed)
```

## Table of Contents

- [RESTful API \& Website w/ Typescript+Postgres+Express Boilerplate](#restful-api--website-w-typescriptpostgresexpress-boilerplate)
  - [Quick Start](#quick-start)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Commands](#commands)
  - [Eslint](#eslint)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
  - [API Documentation](#api-documentation)
    - [API Endpoints](#api-endpoints)
  - [Error Handling](#error-handling)
  - [Validation](#validation)
  - [Authentication](#authentication)
  - [Authorization](#authorization)
  - [Logging](#logging)
  - [paginate](#paginate)
  - [Linting](#linting)
  - [Contributing](#contributing)
  - [By](#by)
  - [Inspirations](#inspirations)
  - [License](#license)

## Features

- **SQL database**: [Postgres](https://www.postgresql.org) object data modeling using [typeORM](https://typeorm.io/#/)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io) - `In progress`
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) - `In progress`
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [NPM](https://www.npmjs.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run prod:start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

```

Linting:

```bash
# run ESLint
npm lint

# fix ESLint errors
npm lint:fix

# run prettier
npm prettier

# fix prettier errors
npm prettier:fix
```

## Eslint

```bash
# Fix Eslint errors
npm run code:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env.example` file. They come with these default values:

```bash
# Project
## Project code name
PROJECT_NAME = express-typescript-postgres
## Project display name
PROJECT_DISPLAY_NAME = Express Typescript Postgres 
## Project description
PROJECT_DESCRIPTION = Fully featured backend API with Express, Typescript, Postgres 


# PORT
PORT = 3000

# DATABASE
DB_USER = postgres
DB_PASSWORD = postgres
DB_HOST = localhost
DB_PORT = 5432
DB_DATABASE = express-typescript-postgres

# TOKEN
SECRET_KEY = secretKey


# JWT
# JWT secret key
JWT_SECRET = thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES = 30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS = 30
# Number of minutes after which a reset password token expires
JWT_RESET_PASSWORD_EXPIRATION_MINUTES = 10
# Number of minutes after which a verify email token expires
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = 10

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST = email-server
SMTP_PORT = 587
SMTP_USERNAME = email-server-username
SMTP_PASSWORD = email-server-password
EMAIL_FROM = support@yourapp.com

# SMS
TWILIO_ACCOUNT_SID = ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN = twilio-auth-token
TWILIO_PHONE_NUMBER = twilio-phone-number

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = false

```

## Project Structure

```
/src
    /abstracts
        common.ts                # Common utilities and functions used across the application.
        controller.base.ts       # Base controller class with common methods for route controllers.
        feature.base.ts          # Base feature class with common methods for feature modules.
        router.base.ts           # Base router class with common methods for route handling.
        service.base.ts          # Base service class with common methods for business logic.
    /config
        index.ts                 # Main configuration file for setting up environment variables and app configurations.
        passport.ts              # Passport configuration for authentication strategies.
        roles.ts                 # Role-based access control configurations.
        tokens.ts                # Token-related configurations for authentication and authorization.
    /database
        index.ts                 # Database setup and connection configurations.
    /features
        /auth
            /controllers
                index.ts         # Index file for exporting all auth-related route controllers.
            /entities
                token.entity.ts  # Token entity class definition for the database model.
            /migrations
                # Database migration files related to authentication feature.
            /routes
                index.ts         # Index file for exporting all auth-related routes.
            /services
                index.ts         # Index file for exporting all auth-related services.
                token.ts         # Service class for token-related business logic.
            /subscribers
                index.ts         # Index file for exporting all auth-related subscribers.
            /validations
                index.ts         # Index file for exporting all auth-related request data validation schemas.
        /user
            /controllers
                index.ts         # Index file for exporting all user-related route controllers.
            /entities
                user.entity.ts   # User entity class definition for the database model.
            /migrations
                # Database migration files related to user feature.
            /routes
                index.ts         # Index file for exporting all user-related routes.
            /services
                index.ts         # Index file for exporting all user-related services.
            /subscribers
                index.ts         # Index file for exporting all user-related subscribers.
            /validations
                index.ts         # Index file for exporting all user-related request data validation schemas.
        /message
            /controllers
                index.ts         # Index file for exporting all message-related route controllers.
            /entities
                message.entity.ts # Message entity class definition for the database model.
            /migrations
                # Database migration files related to message feature.
            /routes
                index.ts         # Index file for exporting all message-related routes.
            /services
                index.ts         # Index file for exporting all message-related services.
            /subscribers
                index.ts         # Index file for exporting all message-related subscribers.
            /validations
                index.ts         # Index file for exporting all message-related request data validation schemas.
    /middlewares
        auth.ts                  # Middleware for authentication and authorization checks.
        error.ts                 # Error handling middleware.
        validate.ts              # Middleware for validating request data.
    /test
        # Test files and configurations.
    /utils
        /services
            /email
                index.ts         # Index file for exporting all email-related utility functions.
            /sms
                index.ts         # Index file for exporting all SMS-related utility functions.
        /validations
            custom.validations.ts # Custom request data validation functions.
        ApiError.ts              # Custom API error class.
        catchAsync.ts            # Utility function for handling async functions and errors.
        dir.ts                   # Utility functions for directory-related operations.
        logger.ts                # Logging utility.
        package.json.ts          # Utility function to read package.json file.
        pick.ts                  # Utility function to pick specific properties from an object.
    app.ts                       # Express application setup and initialization.
    server.ts                    # Entry point for starting the server.

```

## API Documentation
Not available yet.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:id` - get user\
`PATCH /v1/users/:id` - update user\
`DELETE /v1/users/:id` - delete user

**Message routes**:\
`POST /v1/messages` - create a message\
`GET /v1/messages` - get all messages\
`GET /v1/messages/:id` - get message\
`PATCH /v1/messages/:id` - update message\
`DELETE /v1/messages/:id` - delete message

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```typescript
import catchAsync from '@/utils/catchAsync';

// Instead of writing this with try/catch:
export class UserController extends BaseController {
  
// other methods
    
 public login = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
        try {
            // Do something
        } catch (error) {
            next(error);
        }
  });

// other methods
}


// You can write this simply as:
export class UserController extends BaseController {
  
  // other methods

 public login = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Do something
  });

  // other methods
}
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```typescript

export class UserService extends BaseService {
// Other methods

public async findById(id: number): Promise<User> {
    const data: User = await this.repo.findOne({ where: { id: id } });
    if (!data) throw new this.utils.ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
    return data;
}

  // Other methods
}
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/**/validations` directory and are used in the each routes by providing them as parameters to the `validate` middleware.

```typescript

export class UserRoute extends BaseRoute {
  constructor(app: express.Application) {
    // Other routes
    this.router.get('/:id', auth(), validate(UserValidation.get), this.controller.get);
  }
}

```

Note that validation are for each feature are grouped into a class. Above is `UserValidation` class. This is to make it easier to maintain.

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```typescript
this.router.get('/:id', auth(), validate(UserValidation.get), this.controller.get);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env.{env}.local file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env.{env}.local file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```typescript
this.router.get('', auth('manageUsers'), validate(UserValidation.find), this.controller.find);
```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/roles.ts` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/utils/logger.ts`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```typescript
const logger = require('<path to src>/utils/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## paginate

All request to get a list of documents (e.g., GET /v1/users) can be paginated by simply including the pagination parameters (page and limit) in the query string.

Pagination is forced by default. This means that if the client does not specify the pagination parameters in the query string, the response will contain the first page of results (limit = 10 by default).

```typescript
export class UserController extends BaseController {
    // Other methods

    public find = this.utils.catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = this.utils.pick(req.query, ['email']);
    const options = this.utils.pick(req.query, ['sortBy', 'limit', 'page']);
    const datas = await this.service.query(filter, options);
    res.status(httpStatus.OK).send(datas);
  });

  // Other methods
}
```

The `filter` param is an object to be used in a WHERE clause (e.g., { name: 'John Doe' }).\

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:DESC', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The options features also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "datas": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## By 

[Justin Dah-kenangnon](https://dah-kenangnon.com/)
## Inspirations

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate/)

## License

[GPL](LICENSE)
