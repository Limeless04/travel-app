import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Users } from './user.entity';

@Entity('likes')
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' }) // Ensure column name matches DB
  article: Article;

  @ManyToOne(() => Users, (user) => user.likes)
  @JoinColumn({ name: 'userId' }) // Ensure column name matches DB
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}
