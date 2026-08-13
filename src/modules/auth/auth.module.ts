import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../../common/services/token/token.module';
import { MailModule } from '../../common/services/mail/mail.module';

@Module({
  imports: [TokenModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
