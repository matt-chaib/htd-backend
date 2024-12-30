import prisma from "../src/prismaClient.js";

async function main() {
    const q1 = await prisma.question.create({
      data: {
        text: 'What is the meaning of life?',
        summary: 'This question is about the meaning of life.',
        date_used: new Date()
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