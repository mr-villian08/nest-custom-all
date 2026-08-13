import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.NODE_APP_PORT!,
}));
