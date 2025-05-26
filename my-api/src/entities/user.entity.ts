// users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Article } from './article.entity'; // Adjust the import path as necessary
import { Comment } from './comment.entity'; // Adjust the import path as necessary
import { Exclude } from 'class-transformer';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false })
  email: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Column()
  @Exclude()
  password_hash: string;

  @CreateDateColumn()
  createdAt: Date;
}
