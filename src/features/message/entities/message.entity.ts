import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

/**
 * I am the Message's TypeOrm entity model.
 *
 * I am responsible to represent the Message's information in the database.
 *
 * I represent the Message table in the database.
 *
 * I am used by TypeOrm to perform the database operations.
 */
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @IsNotEmpty()
  @Column({ default: false })
  isArchived: boolean;

  @IsNotEmpty()
  @Column()
  author: number;

  @Column()
  @VersionColumn()
  version: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
