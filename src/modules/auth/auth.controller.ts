import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/create-auth-login.dto';
import { AuthRegisterDto } from './dto/create-auth-register.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_APP_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      message: 'Login successful.',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createAuthDto: AuthRegisterDto) {
    return this.authService.register(createAuthDto);
  }
}
