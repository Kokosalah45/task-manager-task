import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt';
import passwordConfig from './config/password';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig, passwordConfig],
      isGlobal: true,
    }),
    AuthModule,
    TasksModule,
    PrismaModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
