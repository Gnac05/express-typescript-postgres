export interface IUser {
  id?: number;
  email: string;
  password: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordMatch: (password: string) => Promise<boolean>;
}
