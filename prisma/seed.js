import prisma from "../src/prismaClient.js";

async function main() {
    // Create some tags
    const ethics = await prisma.tag.create({ data: { name: "Ethics" } });
    const morality = await prisma.tag.create({ data: { name: "Morality" } });
    const justice = await prisma.tag.create({ data: { name: "Justice" } });
    const metaphysics = await prisma.tag.create({ data: { name: "Metaphysics" } });
    const existentialism = await prisma.tag.create({ data: { name: "Existentialism" } });

    const q1 = await prisma.question.create({
      data: {
        text: 'What is the meaning of life?',
        summary: 'This question is about the meaning of life.',
        date_used: new Date(),
        tags: {
          connect: [{ id: metaphysics.id }, { id: ethics.id }, { id: existentialism.id }],
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