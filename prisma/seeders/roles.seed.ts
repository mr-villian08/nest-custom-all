import { PrismaClient } from '../../src/generated/prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  const roles = [
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Full access to all resources.',
    },
    {
      name: 'Employee',
      slug: 'employee',
      description: 'Can manage user accounts and view reports.',
    },
    {
      name: 'Viewer',
      slug: 'viewer',
      description: 'View and reporting access only',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        slug: role.slug,
      },
      update: {},
      create: role,
    });
  }
}
