import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.NODE_APP_DATABASE_URL!,
}));
