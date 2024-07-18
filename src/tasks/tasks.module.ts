import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/services/auth.service';
import { PasswordService } from 'src/auth/services/password.service';

@Module({
  imports: [UsersModule],
  controllers: [TasksController],
  providers: [TasksService, AuthService, PasswordService],
})
export class TasksModule {}
