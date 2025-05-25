import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true })) 
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
   @UsePipes(new ValidationPipe({ transform: true })) 
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
