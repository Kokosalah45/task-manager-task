import { Injectable } from '@nestjs/common';
import { Task, Prisma, TaskCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async tasks(params: {
    userName: string;
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    owned?: boolean;
  }): Promise<Task[]> {
    const { skip, take, cursor, orderBy } = params;

    const where = params.owned
      ? {
          user_id: (await this.usersService.getByUserName(params.userName))
            .user_id,
        }
      : {
          is_shared: true,
        };

    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      orderBy,
      where,
    });
  }

  async createTask(
    data: Prisma.TaskCreateInput,
    userName: string,
  ): Promise<Task> {
    const user = await this.usersService.getByUserName(userName);

    return this.prisma.task.create({
      data: {
        ...data,
        user: {
          connect: { user_id: user.user_id },
        },
      },
    });
  }

  async linkTaskWithCategory(
    data: {
      task_id: number;
      category_id: number;
    },
    userName: string,
  ): Promise<TaskCategory> {
    const user = await this.usersService.getByUserName(userName);

    return await this.prisma.taskCategory.create({
      data: {
        user: {
          connect: { user_id: user.user_id },
        },
        task: {
          connect: { task_id: data.task_id },
        },
        category: {
          connect: { category_id: data.category_id },
        },
      },
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { data, where } = params;

    return this.prisma.task.update({
      data,
      where,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }
}
