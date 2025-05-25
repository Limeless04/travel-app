import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'Username for registration' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'Email address for registration' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password (minimum 6 characters)' })
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({ description: 'Email address for login' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password for login' })
    @MinLength(6)
    password: string;
}