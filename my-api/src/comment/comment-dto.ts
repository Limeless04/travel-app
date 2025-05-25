import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content?: string;
}
