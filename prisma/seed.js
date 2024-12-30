import prisma from "../src/prismaClient.js";

async function main() {
    // Create some tags
    const ethics = await prisma.tag.create({ data: { name: "Ethics" } });
    const morality = await prisma.tag.create({ data: { name: "Morality" } });
    const justice = await prisma.tag.create({ data: { name: "Justice" } });

    const q1 = await prisma.question.create({
      data: {
        text: 'What is the meaning of life?',
        summary: 'This question is about the meaning of life.',
        date_used: new Date(),
        tags: {
          connect: [{ id: ethics.id }, { id: morality.id }, { id: justice.id }],
        },
      },
      include: {
        tags: true,
      },
    })
  
    console.log({ q1 })
  }
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })