import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/create-auth-login.dto';
import { AuthRegisterDto } from './dto/create-auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createAuthDto: AuthLoginDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createAuthDto: AuthRegisterDto) {
    return this.authService.register(createAuthDto);
  }
}
