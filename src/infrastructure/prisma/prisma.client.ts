import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.NODE_APP_DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
