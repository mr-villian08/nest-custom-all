import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: this.configService.getOrThrow<string>(
        'jwt.accessTokenExpiresIn',
      ) as StringValue,
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: this.configService.getOrThrow<string>(
        'jwt.refreshTokenExpiresIn',
      ) as StringValue,
    });
  }

  async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
