import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.user.findFirst();
  }

  async getByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  async getByUserName(name: string) {
    return await this.prismaService.user.findFirst({
      where: {
        name,
      },
    });
  }
  async create(data: CreateUserDto) {
    return await this.prismaService.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  }
}
