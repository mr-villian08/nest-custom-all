import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  environment: process.env.NODE_APP_ENV ?? 'development',
}));
