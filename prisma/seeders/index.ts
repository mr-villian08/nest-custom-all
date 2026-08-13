import { seed } from './seed';

seed().catch((error) => {
  console.error('Error seeding the database:', error);
  process.exit(1);
});
