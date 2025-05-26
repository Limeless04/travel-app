// src/comment/comment.entity.ts (suggested file path)
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Users } from './user.entity';
import { Type } from 'class-transformer';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  content: string;

  // Many-to-One relationship with Article
  // A comment belongs to one article
  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article; // This will create 'articleId' (or 'article_id') foreign key column

  // Many-to-One relationship with Users (for the author)
  // A comment is written by one user
  @ManyToOne(() => Users, (user) => user.comments, {
    onDelete: 'CASCADE',
    eager: false,
  })
  author: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}