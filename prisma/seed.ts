import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Truths
  const truthsData = [
    { content: "What's your biggest fear?" },
    { content: "Have you ever lied to your best friend?" },
    { content: "What's your most embarrassing moment?" },
  ];

  for (const truth of truthsData) {
    await prisma.truth.create({ data: truth });
  }

  // Dares
  const daresData = [
    { content: "Do 10 push-ups" },
    { content: "Sing a song loudly" },
    { content: "Dance for 30 seconds" },
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
