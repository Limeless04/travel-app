import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user-dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(Number(id));
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(Number(id), updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.userService.remove(Number(id));
    }
}