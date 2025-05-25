import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) {}

    async findAll(): Promise<Users[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<Users | null> {
        return this.userRepository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.userRepository.findOne({
            where: { email },
        });
    }
    async create(userData: Partial<Users>): Promise<Users> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async update(id: number, updateData: Partial<Users>): Promise<Users | null> {
        await this.userRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}