import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './common/services/files/files.module';
import { HashService } from './common/services/hash/hash.service';
import { HashModule } from './common/services/hash/hash.module';
import { MailModule } from './common/services/mail/mail.module';
import { TokenModule } from './common/services/token/token.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [FilesModule, HashModule, MailModule, TokenModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, HashService],
})
export class AppModule {}
