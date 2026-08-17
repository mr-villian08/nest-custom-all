import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginDto } from './dto/create-auth-login.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { HashService } from '../../common/services/hash/hash.service';
import { TokenService } from '../../common/services/token/token.service';
import { AuthRegisterDto } from './dto/create-auth-register.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {}

  // ? ****************************************** Login User ****************************************** */
  async login(loginAuthDto: AuthLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email!,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        password: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = this.hashService.compare(
      loginAuthDto.password!,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.roles[0]?.role,
    };

    const tokens = await this.tokenService.generateTokens(payload);

    return {
      user: payload,
      tokens,
    };
  }

  // ? ****************************************** Register User ****************************************** */
  async register(registerAuthDto: AuthRegisterDto) {
    const passwordHash = this.hashService.make(registerAuthDto.password!);

    const user = await this.prisma.user.create({
      data: {
        firstName: registerAuthDto.firstName!,
        lastName: registerAuthDto.lastName!,
        email: registerAuthDto.email!,
        password: passwordHash,
        phone: registerAuthDto.phone!,
        username: registerAuthDto.username!,
        roles: {
          create: {
            role: {
              connect: {
                slug: registerAuthDto.role!,
              },
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Custom All',
      template: 'welcome',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        password: registerAuthDto.password,
        loginUrl: process.env.NODE_APP_LOGIN_URL,
        year: new Date().getUTCFullYear(),
      },
    });

    return user;
  }
}
