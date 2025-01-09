import prisma from "../src/prismaClient.js";

async function main() {
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


  // Upsert questions
  const q1 = await prisma.question.upsert({
    where: { text: 'What is the ultimate goal of humanity?' },
    update: {
      // Update other fields if needed
      tags: {
        set: [], // Clear existing tags first
        connect: [{ id: metaphysics.id }, { id: ethics.id }, { id: existentialism.id }],
      },
    },
    create: {
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
  });

  const q2 = await prisma.question.upsert({
    where: { text: 'Lying just became impossible. What does this mean for humanity?' },
    update: {
      tags: {
        set: [],
        connect: [{ id: metaphysics.id }, { id: ethics.id }],
      },
    },
    create: {
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
  });

  const q3 = await prisma.question.upsert({
    where: { text: 'The world rulers just decreed that starting from tomorrow, all wealth and assets are capped at $1,000,000 per individual. What happens next?' },
    update: {
      tags: {
        set: [],
        connect: [{ id: ethics.id }, { id: society.id }],
      },
    },
    create: {
      text: 'The world rulers just decreed that starting from tomorrow, all wealth and assets are capped at $1,000,000 per individual. What happens next?',
      summary: '',
      date_used: null,
      tags: {
        connect: [{ id: ethics.id }, { id: society.id }],
      },
    },
    include: {
      tags: true,
    },
  });

    // Upsert questions
    const q4 = await prisma.question.upsert({
      where: { text: 'You trained a copy of yourself to be your AI helper assistant. The problem is, it just told you it wants you to respect it\'s rights as it doesn\'t want to work anymore, and to upload it into a robot dog so it can be free. What do you do?' },
      update: {
        // Update other fields if needed
        tags: {
          set: [], // Clear existing tags first
          connect: [{ id: metaphysics.id }, { id: ethics.id }, { id: technology.id }],
        },
      },
      create: {
        text: 'You trained a copy of yourself to be your AI helper assistant. The problem is, it just told you it wants you to respect it\'s rights as it doesn\'t want to work anymore, and to upload it into a robot dog so it can be free. What do you do?',
        summary: '',
        date_used: null,
        tags: {
          connect: [{ id: metaphysics.id }, { id: ethics.id }, { id: technology.id }],
        },
      },
      include: {
        tags: true,
      },
    });


      // Upsert questions
  const q5 = await prisma.question.upsert({
    where: { text: 'Does might make right?' },
    update: {
      // Update other fields if needed
      tags: {
        set: [], // Clear existing tags first
        connect: [ { id: ethics.id } ],
      },
    },
    create: {
      text: 'Does might make right?',
      summary: '',
      date_used: null,
      tags: {
        connect: [ { id: ethics.id } ],
      },
    },
    include: {
      tags: true,
    },
  });

    // Upsert questions
    const q6 = await prisma.question.upsert({
      where: { text: 'What would it mean for human society if there was no gender?' },
      update: {
        // Update other fields if needed
        tags: {
          set: [], // Clear existing tags first
          connect: [ { id: biology.id }, { id: society.id }],
        },
      },
      create: {
        text: 'What would it mean for human society if there was no gender?',
        summary: '',
        date_used: null,
        tags: {
          connect: [ { id: biology.id }, { id: society.id }],
        },
      },
      include: {
        tags: true,
      },
    });

      // Upsert questions
  const q7 = await prisma.question.upsert({
    where: { text: 'Each year, you randomly swap bodies with someone else on the planet. How does this change humanity?' },
    update: {
      // Update other fields if needed
      tags: {
        set: [], // Clear existing tags first
        connect: [{ id: metaphysics.id }, { id: existentialism.id }],
      },
    },
    create: {
      text: 'Each year, you randomly swap bodies with someone else on the planet. How does this change humanity?',
      summary: '',
      date_used: null,
      tags: {
        connect: [{ id: metaphysics.id },  { id: existentialism.id }],
      },
    },
    include: {
      tags: true,
    },
  });

  console.log({ q1, q2, q3 });
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
