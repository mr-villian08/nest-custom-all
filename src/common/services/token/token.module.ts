import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // <-- Required
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        expiresIn: config.getOrThrow<string>('jwt.accessTokenExpiresIn'),
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
