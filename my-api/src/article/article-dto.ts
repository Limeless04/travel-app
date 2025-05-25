import { IsString, IsOptional, IsInt, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    summary: string;


    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    @IsInt()
    like?: number;

    @IsInt()
    authorId: number;

}

export class UpdateArticleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content?: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsOptional()
    @IsString()
    image_url?: string;
}