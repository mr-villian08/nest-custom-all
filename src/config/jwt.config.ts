import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.NODE_APP_JWT_SECRET!,
  accessTokenExpiresIn: process.env.NODE_APP_JWT_ACCESS_TOKEN_EXPIRATION!,
  refreshTokenExpiresIn: process.env.NODE_APP_JWT_REFRESH_TOKEN_EXPIRATION!,
}));
