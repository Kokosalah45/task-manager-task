import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { PasswordService } from 'src/auth/services/password.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, AuthService, PasswordService],
})
export class CategoriesModule {}
