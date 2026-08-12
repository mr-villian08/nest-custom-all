import * as path from 'node:path';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './common/services/files/files.module';
import { HashModule } from './common/services/hash/hash.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { TokenModule } from './common/services/token/token.module';

import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { MailModule } from './common/services/mail/mail.module';

import fileConfig from './config/file.config';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, fileConfig, mailConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
    }),
    PrismaModule,
    AuthModule,
    TokenModule,
    HashModule,
    FilesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
