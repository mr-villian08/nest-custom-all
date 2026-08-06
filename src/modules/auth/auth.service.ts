import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/create-auth-login.dto';
import { AuthRegisterDto } from './dto/create-auth-register.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  login(loginAuthDto: AuthLoginDto) {
    return 'This action logs in a user';
  }

  async register(registerAuthDto: AuthRegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: registerAuthDto.email,
      },
    });

    if (exists) {
      throw new BadRequestException('Email already exists.');
    }

    const passwordHash = await bcrypt.hash(registerAuthDto.password!, 10);

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

    return user;
  }
}
