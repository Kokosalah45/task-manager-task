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
import { CategoriesService } from './categories.service';
import { Category, Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/RequestWithUser';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(
    @Req() req: RequestWithUser,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
    @Query('orderBy') orderBy?: Prisma.CategoryOrderByWithRelationInput,
  ): Promise<{
    categories: Category[];
  }> {
    const userName = req.user.name;

    const categories = await this.categoriesService.categories({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      cursor: cursor ? { category_id: Number(cursor) } : undefined,
      orderBy,
      userName,
    });

    return {
      categories,
    };
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createCategory(
    @Body() data: Prisma.CategoryCreateInput,
    @Req() req: RequestWithUser,
  ) {
    const userName = req.user.name;
    await this.categoriesService.createCategory(data, userName);

    return {
      message: 'Category created successfully',
      status: 'success',
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnershipGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Prisma.CategoryUpdateInput,
  ) {
    await this.categoriesService.updateCategory({
      where: { category_id: Number(id) },
      data,
    });

    return {
      message: 'Category updated successfully',
      status: 'success',
    };
  }

  @UseGuards(OwnershipGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.deleteCategory({ category_id: Number(id) });
  }
}
