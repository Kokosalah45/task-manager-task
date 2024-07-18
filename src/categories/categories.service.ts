import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async categories(params: {
    userName: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
    owned?: boolean;
  }): Promise<Category[]> {
    const { skip, take, cursor, orderBy } = params;

    const where = params.owned
      ? {
          user_id: (await this.usersService.getByUserName(params.userName))
            .user_id,
        }
      : {
          is_shared: true,
        };

    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      orderBy,
      where,
    });
  }

  async createCategory(
    data: Prisma.CategoryCreateInput,
    userName: string,
  ): Promise<Category> {
    const user = await this.usersService.getByUserName(userName);

    return this.prisma.category.create({
      data: {
        ...data,
        user: {
          connect: { user_id: user.user_id },
        },
      },
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { data, where } = params;

    return this.prisma.category.update({
      data,
      where,
    });
  }

  async deleteCategory(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    return this.prisma.category.delete({
      where,
    });
  }
}
