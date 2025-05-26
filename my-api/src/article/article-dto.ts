import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content of the article' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'A brief summary of the article' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiPropertyOptional({ description: 'URL of the article image' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ description: 'Number of likes on the article' })
  @IsOptional()
  @IsInt()
  like?: number;

  @ApiProperty({ description: 'ID of the article author' })
  @IsInt()
  authorId: number;
}

export class UpdateArticleDto {
  @ApiPropertyOptional({ description: 'The updated title of the article' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ description: 'The updated content of the article' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty({ description: 'The updated summary of the article' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiPropertyOptional({ description: 'Updated URL of the article image' })
  @IsOptional()
  @IsString()
  image_url?: string;
}

export class CommentDto {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    username: string;
  };
}

export class ArticleDto {
  id: number;
  title: string;
  slug: string;
  summary: string;
  image_url: string;
  total_likes: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    username: string;
  };
  comments: CommentDto[];
}