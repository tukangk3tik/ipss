import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Add this to prevent jest warnings about open handles
jest.setTimeout(30000); // Optional: increases timeout to 30 seconds 