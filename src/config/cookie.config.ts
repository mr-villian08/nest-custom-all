import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => ({
  refreshToken: {
    httpOnly: true,
    secure: process.env.NODE_APP_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
}));
