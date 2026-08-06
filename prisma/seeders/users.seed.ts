import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: {
      email: 'admin@ott.com',
    },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',

      email: 'admin@ott.com',
      username: 'superadmin',
      phone: '9999999999',

      password: await bcrypt.hash('Password@890', 10),

      emailVerified: true,

      roles: {
        create: {
          role: {
            connect: {
              slug: 'admin',
            },
          },
        },
      },
    },
  });
}
