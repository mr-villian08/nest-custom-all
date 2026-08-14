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
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    const { name, httpOnly, secure, sameSite, maxAge } =
      this.configService.getOrThrow<{
        name: string;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'lax' | 'strict' | 'none';
        maxAge: number;
      }>('cookie.refreshToken');

    res.cookie(name, tokens.refreshToken, {
      httpOnly,
      secure,
      sameSite,
      maxAge,
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
