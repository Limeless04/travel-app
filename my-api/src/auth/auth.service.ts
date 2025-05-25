import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './auth-dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password_hash: passwordHash,
    });
    // Remove password_hash from the response using destructuring
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(dto: LoginDto): Promise<{ user: any; access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const { password_hash, ...userWithoutPassword } = user;
    return {
    user: userWithoutPassword,
      access_token: this.jwtService.sign(payload),
    };
  }
}
