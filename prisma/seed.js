import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from "../src/prismaClient.js";

async function main() {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const questionsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../questions.json'), 'utf8')
  );


  // Upsert tags
  const ethics = await prisma.tag.upsert({
    where: { name: "Ethics" },
    update: {}, // No update needed for now
    create: { name: "Ethics" },
  });

  const morality = await prisma.tag.upsert({
    where: { name: "Morality" },
    update: {},
    create: { name: "Morality" },
  });

  const justice = await prisma.tag.upsert({
    where: { name: "Justice" },
    update: {},
    create: { name: "Justice" },
  });

  const metaphysics = await prisma.tag.upsert({
    where: { name: "Metaphysics" },
    update: {},
    create: { name: "Metaphysics" },
  });

  const existentialism = await prisma.tag.upsert({
    where: { name: "Existentialism" },
    update: {},
    create: { name: "Existentialism" },
  });

  const technology = await prisma.tag.upsert({
    where: { name: "Technology" },
    update: {},
    create: { name: "Technology" },
  });

  const biology = await prisma.tag.upsert({
    where: { name: "Biology" },
    update: {},
    create: { name: "Biology" },
  });

  const society = await prisma.tag.upsert({
    where: { name: "Society" },
    update: {},
    create: { name: "Society" },
  });

  const identity = await prisma.tag.upsert({
    where: { name: "Identity" },
    update: {},
    create: { name: "Identity" },
  });

  const tagMap = {
    metaphysics,
    ethics,
    society,
    technology,
    biology,
    existentialism,
    identity
  };

  for (const question of questionsData) {
      await prisma.question.upsert({
        where: { text: question.text },
        update: {
          tags: {
            set: [], // Clear existing tags
            connect: question.tags.map(tagName => ({ id: tagMap[tagName].id })),
          },
        },
        create: {
          text: question.text,
          summary: '',
          date_used: null,
          tags: {
            connect: question.tags.map(tagName => ({ id: tagMap[tagName].id })),
          },
        },
        include: {
          tags: true,
        },
      });
    }

    console.log(questionsData.length())


}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
