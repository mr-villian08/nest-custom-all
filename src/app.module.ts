import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileService } from './common/services/file/file.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './common/services/token/token.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    PrismaModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileService],
})
export class AppModule {}
