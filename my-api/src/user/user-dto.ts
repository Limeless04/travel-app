import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Username of the user' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password (minimum 6 characters)' })
    @IsString()
    @MinLength(6)
    password: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'Updated username' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ description: 'Updated email address' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Updated password (minimum 6 characters)' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}