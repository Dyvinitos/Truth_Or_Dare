// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  console.log("Seeding database...");

  // Truths
  const truthsData = [
  ];

  for (const truth of truthsData) {
    await prisma.truth.create({ data: truth });
  }

  // Dares
  const daresData = [
    { content: "TEST SEED"},
  ];

  for (const dare of daresData) {
    await prisma.dare.create({ data: dare });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
