import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileService } from './common/services/file/file.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './common/services/token/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { HashModule } from './common/services/hash/hash.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { StorageDriver } from './infrastructure/storage/enums/storage-driver.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    PrismaModule,
    AuthModule,
    TokenModule,
    HashModule,
    // StorageModule.register({
    //   defaultDriver: StorageDriver.LOCAL,
    // }),
    StorageModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaultDriver: config.getOrThrow<StorageDriver>('storage.driver'),
        root: config.getOrThrow<string>('storage.root'),
        publicUrl: config.getOrThrow<string>('storage.publicUrl'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FileService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
