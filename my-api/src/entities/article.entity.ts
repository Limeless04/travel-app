import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Users } from './user.entity';
import { Comment } from './comment.entity';
import { Type, Exclude } from 'class-transformer';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  @Column({ nullable: true })
  slug: string;

  @Column('text')
  summary: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  image_url: string;

  @Column('int', { default: 0 })
  total_likes: number;

  @ManyToOne(() => Users, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  @Type(() => Users)
  author: Users;

  @OneToMany(() => Comment, (comment) => comment.article, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
