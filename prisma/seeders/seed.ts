import { prisma } from '../../src/infrastructure/prisma/prisma.client';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';

export async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    await seedRoles(prisma);
    await seedUsers(prisma);

    console.log('✅ Database seeded successfully.');
  } catch (error) {
    console.error(error);

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
