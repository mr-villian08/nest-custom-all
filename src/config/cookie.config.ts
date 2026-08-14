import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => ({
  refreshToken: {
    name: 'refresh_token',
    httpOnly: true,
    secure: process.env.NODE_APP_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge:
      Number(process.env.NODE_APP_REFRESH_TOKEN_COOKIE_MAX_AGE) ||
      1000 * 60 * 60 * 24 * 30,
  },
}));
