import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Users } from '../entities/user.entity'; // Import Users entity
import { Likes } from '../entities/like.entity'; // Import Like entity
@Module({
  imports: [TypeOrmModule.forFeature([Article, Users, Likes])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
