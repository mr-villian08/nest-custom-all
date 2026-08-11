import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './common/services/token/token.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { HashModule } from './common/services/hash/hash.module';
import { FilesModule } from './common/files/files.module';
import fileConfig from './config/file.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, fileConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
    }),
    PrismaModule,
    AuthModule,
    TokenModule,
    HashModule,
    FilesModule,
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
