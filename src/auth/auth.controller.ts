import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDTO } from './dtos/sigin-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { MeDTO } from './dtos/me.dto';
import { RequestWithUser } from './interfaces/RequestWithUser';
import { Response } from 'express';
import { InvalidCredentialsException } from 'src/errors/InvalidCredentialsException';
import { AlreadyExistException } from 'src/errors/AlreadyExistException';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    const isUser = await this.authService.addUser(user);

    if (!isUser) {
      throw new AlreadyExistException('User');
    }

    return {
      message: 'User created successfully',
    };
  }

  @Post('signin')
  async signIn(
    @Body() user: SigninUserDTO,
    @Query('storageType')
    storageType: 'localStorage' | 'cookie' = 'localStorage',
    @Res() res: Response,
  ) {
    const userToken = await this.authService.signIn(user);

    if (!userToken) {
      throw new InvalidCredentialsException();
    }

    if (storageType === 'cookie') {
      res.cookie('access_token', userToken.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.json({
        message: 'User logged in successfully',
      });
    }

    return res.json(userToken);
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      message: 'User logged out successfully',
    });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  me(@Req() req: RequestWithUser): MeDTO {
    const meDTO = new MeDTO(req.user);
    return meDTO;
  }
}
