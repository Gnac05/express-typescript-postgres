import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '@config';
import { tokenTypes } from './tokens';
import { UserService } from '@/features/user.api/services';
import { Container } from 'typedi';
import { logger } from '@/utils/logger';

/** Jwt options */
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 * Verifies the token extracted from the request
 *
 * @param payload The payload extracted from the token
 * @param done The callback to be called when finished
 * @returns Promise<any>
 */
const jwtVerify = async (payload, done) => {
  const userService = Container.get(UserService);

  try {
    if (payload.type !== tokenTypes.ACCESS) {
      logger.error('Invalid token type');
      throw new Error('Invalid token type');
    }
    const user = await userService.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    logger.error('JwtVerify: ', error);
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
