import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import bcrypt from 'bcrypt';

/**
 * I am the User's TypeOrm entity model.
 *
 * I am responsible to represent the user's information in the database.
 *
 * I represent the user table in the database.
 *
 * I am used by TypeOrm to perform the database operations.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @IsNotEmpty()
  @Column({ default: false })
  isEmailVerified: boolean;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @VersionColumn()
  version: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  public async isPasswordMatch(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
