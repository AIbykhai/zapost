import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

async function setupTestDatabase() {
  // Set test database URL
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/askkhai_test?schema=public';

  try {
    // Create test database
    execSync('createdb askkhai_test');
    console.log('Test database created successfully');
  } catch (error) {
    console.log('Test database might already exist, continuing...');
  }

  // Run migrations
  try {
    execSync('npx prisma migrate deploy');
    console.log('Migrations applied successfully');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }

  // Clean up test data
  const prisma = new PrismaClient();
  try {
    await prisma.scheduledPost.deleteMany();
    await prisma.post.deleteMany();
    await prisma.brandProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log('Test data cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestDatabase(); 