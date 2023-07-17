import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn, ManyToOne } from 'typeorm';
import { User } from '@/features/user/entities/user.entity';

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

  // Comments: {author: email, content: string, createdAt: Date, updatedAt: Date} as json array
  @Column({ type: 'jsonb', nullable: true })
  comments: JSON[];

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
