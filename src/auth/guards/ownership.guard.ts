import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { UsersService } from 'src/users/users.service';
import { Category, Task } from '@prisma/client';

type RequestWithResource = RequestWithUser & {
  resource: Task | Category;
};

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithResource>();
    const user = request.user;
    const resourceClass = context.getClass().name;
    const resourceHandler = context.getHandler().name;
    console.log({ resourceHandler });

    const resourceId = Number(context.switchToHttp().getRequest().params.id);

    const resourceBody = context.switchToHttp().getRequest().body;

    if (!user || !resourceClass || (isNaN(resourceId) && !resourceBody)) {
      throw new ForbiddenException('Access denied');
    }

    const userID = (await this.usersService.getByUserName(user.name)).user_id;
    console.log({
      userID,
      resourceId,
      resourceClass,
    });
    switch (resourceClass) {
      case 'TasksController':
        if (resourceHandler === 'linkTaskWithCategory') {
          const category = await this.prisma.category.findUnique({
            where: { category_id: resourceBody.category_id },
          });
          const task = await this.prisma.task.findUnique({
            where: { task_id: resourceBody.task_id },
          });

          console.log({
            task,
            category,
            userID,
          });

          if (
            !category ||
            !task ||
            category.user_id !== userID ||
            task.user_id !== userID
          ) {
            return false;
          }

          return true;
        }

        const task = await this.prisma.task.findUnique({
          where: { task_id: resourceId },
        });

        if (!task || task.user_id !== userID) {
          return false;
        }

      case 'CategoriesController':
        const category = await this.prisma.category.findUnique({
          where: { category_id: resourceId },
        });
        if (!category || category.user_id !== userID) {
          return false;
        }

      default:
        return true;
    }
  }
}
