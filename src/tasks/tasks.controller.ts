import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getTasks(
    @Req() req: RequestWithUser,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
    @Query('orderBy') orderBy?: Prisma.TaskOrderByWithRelationInput,
  ): Promise<{
    tasks: Task[];
  }> {
    const userName = req.user.name;

    const tasks = await this.taskService.tasks({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      cursor: cursor ? { task_id: Number(cursor) } : undefined,
      orderBy,
      userName,
    });

    return {
      tasks,
    };
  }

  @Get(':username')
  async getPublicTasksOfUser(@Param('username') userName: string) {
    const tasks = await this.taskService.tasks({
      userName,
      owned: true,
    });

    return {
      tasks,
    };
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createTask(
    @Body() data: Prisma.TaskCreateInput,
    @Req() req: RequestWithUser,
  ) {
    const userName = req.user.name;
    await this.taskService.createTask(data, userName);

    return {
      message: 'Task created successfully',
      status: 'success',
    };
  }

  @UseGuards(OwnershipGuard)
  @Post('addCategoryToTask')
  async linkTaskWithCategory(
    @Body()
    data: {
      category_id: number;
      task_id: number;
    },
    @Req() req: RequestWithUser,
  ) {
    const userName = req.user.name;
    await this.taskService.linkTaskWithCategory(data, userName);

    return {
      message: 'Category added to task successfully',
      status: 'success',
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnershipGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ) {
    await this.taskService.updateTask({
      where: { task_id: Number(id) },
      data,
    });

    return {
      message: 'Task updated successfully',
      status: 'success',
    };
  }

  @UseGuards(OwnershipGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.deleteTask({ task_id: Number(id) });
  }
}
