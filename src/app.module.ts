import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './common/services/files/files.module';
import { HashModule } from './common/services/hash/hash.module';
import { MailModule } from './common/services/mail/mail.module';
import { TokenModule } from './common/services/token/token.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),
    FilesModule,
    HashModule,
    MailModule,
    TokenModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
