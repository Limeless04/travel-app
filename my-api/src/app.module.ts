import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './database/typeorm.config';
import { UserModule } from './user/user.module'; // Adjust the import path as necessary
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    ArticleModule,
    AuthModule,
    CommentModule,
  ],
})
export class AppModule {}
