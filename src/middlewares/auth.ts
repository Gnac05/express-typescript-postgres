import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { User } from '@/features/user/entities/user.entity';

const verifyCallback = (req: Request, resolve: any, reject: any, requiredRights: any[]) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }

  req.user = user as User;

  // Ensure user has required rights
  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Authenticating user...: ', req.user);
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch(err => {
        console.log('Error authenticating user: ', err);
        next(err);
      });
  };

export default auth;
