import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy'; // Ensure you have a JwtStrategy defined
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', // Use a secure secret in production
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy ]
})
export class AuthModule {}
