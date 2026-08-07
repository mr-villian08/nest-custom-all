import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  driver: process.env.NODE_APP_STORAGE_DRIVER ?? 'local',

  root: process.env.NODE_APP_STORAGE_ROOT ?? 'storage',

  publicUrl:
    process.env.NODE_APP_STORAGE_PUBLIC_URL ?? 'http://localhost:3000/storage',
}));
