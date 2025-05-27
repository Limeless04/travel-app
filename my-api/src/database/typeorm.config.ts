// src/database/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Users } from '../entities/user.entity'; // Adjust the import path as necessary
import { Article } from 'src/entities/article.entity';
import { Comment } from 'src/entities/comment.entity'; // Adjust the import path as necessary
import { Likes } from 'src/entities/like.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Users, Article, Comment, Likes],
  synchronize: process.env.NODE_ENV !== 'production',
};
