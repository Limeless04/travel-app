import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Article } from './article.entity';
import { Users } from './user.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}