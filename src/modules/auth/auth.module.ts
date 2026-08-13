import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../../common/services/token/token.module';
import { MailModule } from '../../common/services/mail/mail.module';
import { HashModule } from '../../common/services/hash/hash.module';

@Module({
  imports: [TokenModule, MailModule, HashModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
