import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID of the article being commented on' })
  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  @ApiProperty({ description: 'ID of the comment author' })
  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'The updated content of the comment' })
  @IsString()
  @IsNotEmpty()
  content?: string;
}
