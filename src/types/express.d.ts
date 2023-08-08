import { User } from '@/features/user.api/entities/user.entity';

// express session
declare module 'express-session' {
  interface SessionData {
    /** Represent the logged user on the session */
    user: User;
    /** Represent if the user is authenticated or not */
    isAuth: boolean;
    /** Represent any other data stored on the session */
    data: any;
    /** Represent the flash messages */
    flash: any;
  }
}
