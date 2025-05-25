import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity'; // Adjust the import path as necessary

@Module({
    imports: [TypeOrmModule.forFeature([Users])], // <-- Make sure this is here
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // export if used elsewhere
})
export class UserModule {}