import prisma from "../src/prismaClient.js";

async function main() {
    // Create some tags
    const ethics = await prisma.tag.upsert({
      where: { name: "Ethics" },
      update: {}, // No update needed
      create: { name: "Ethics" }
    });
    
    const morality = await prisma.tag.upsert({
      where: { name: "Morality" },
      update: {},
      create: { name: "Morality" }
    });
    
    const justice = await prisma.tag.upsert({
      where: { name: "Justice" },
      update: {},
      create: { name: "Justice" }
    });
    
    const metaphysics = await prisma.tag.upsert({
      where: { name: "Metaphysics" },
      update: {},
      create: { name: "Metaphysics" }
    });
    
    const existentialism = await prisma.tag.upsert({
      where: { name: "Existentialism" },
      update: {},
      create: { name: "Existentialism" }
    });
    

    const q1 = await prisma.question.create({
      data: {
        text: 'What is the ultimate goal of humanity?',
        summary: '',
        date_used: null,
        tags: {
          connect: [{ id: metaphysics.id }, { id: ethics.id }, { id: existentialism.id }],
        },
      },
      include: {
        tags: true,
      },
    })

    const q2 = await prisma.question.create({
      data: {
        text: 'Lying just became impossible. What does this mean for humanity?',
        summary: '',
        date_used: null,
        tags: {
          connect: [{ id: metaphysics.id }, { id: ethics.id }],
        },
      },
      include: {
        tags: true,
      },
    })
  

    const q3 = await prisma.question.create({
      data: {
        text: 'The world rulers just decreed that starting from tomorrow, all wealth and assets are capped at $1,000,000 per individual. What happens next?',
        summary: '',
        date_used: null,
        tags: {
          connect: [ { id: ethics.id } ],
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