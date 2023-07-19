import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@features/user/entities/user.entity';
import { tokenTypes } from '@config/tokens';

/**
 * I am the Token's TypeOrm entity model.
 *
 * I am responsible to hold user tokens in the database.
 *
 * I represent the token table in the database.
 */
@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: tokenTypes })
  type: string;

  @Column()
  expires: Date;

  @Column({ default: false })
  blacklisted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
