import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getQuestionOfTheDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure the date is at midnight for comparison

  try {
    // Step 1: Check if a question is already assigned for today
    const existingQotd = await prisma.questionOfTheDay.findUnique({
      where: { date: today },
      include: { question: true }, // Fetch the associated question
    });

    if (existingQotd) {
      return existingQotd.question; // Return the question if found
    }

    // Step 2: Fetch a random unused question
    const unusedQuestions = await prisma.question.findMany({
        where: {
          NOT: {
            questionOfTheDayLogs: {
              some: {}, // Exclude questions already used in QuestionOfTheDay
            },
          },
        },
      });
      

    let selectedQuestion;

    if (unusedQuestions.length > 0) {
      // Randomly select an unused question
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      selectedQuestion = unusedQuestions[randomIndex];
    } else {
      // If all questions have been used, select a random question from all
      const allQuestions = await prisma.question.findMany({
        include: {
            tags: true,
          },
    });
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      selectedQuestion = allQuestions[randomIndex];
    }

    await prisma.question.update({
        where: { id: selectedQuestion.id },
        data: {
          date_used: today, // Set the `date_used` field to today
        },
      });

    // Step 3: Insert the selected question into `QuestionOfTheDay`
    await prisma.questionOfTheDay.create({
      data: {
        questionId: selectedQuestion.id,
        date: today,
      },
    });

    return selectedQuestion; // Return the selected question
  } catch (error) {
    console.error('Error fetching question of the day:', error);
    throw new Error('Could not fetch question of the day');
  }
}
