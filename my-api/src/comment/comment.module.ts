import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Article } from 'src/entities/article.entity';
import { Users } from 'src/entities/user.entity'; // Import Users entity

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Article, Users])], 
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
