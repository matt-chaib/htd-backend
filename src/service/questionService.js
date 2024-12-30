import { PrismaClient } from '@prisma/client';
import snoowrap from 'snoowrap'

const prisma = new PrismaClient();

const reddit = new snoowrap({
  userAgent: 'QOTD Bot by /u/Free_Cash8050', // A description of your bot
  clientId: 'pRo9hPnXAcuTWnaYYXjVhA',
  clientSecret: `${process.env.REDDIT_SECRET}`,
  username: 'Free_Cash8050',
  password:  `${process.env.REDDIT_ACC_PASS}`
});


export async function getQuestionOfTheDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure the date is at midnight for comparison

  console.log("getting question of the day")
  const subredditName = 'hashtagdeep'; // Replace with your subreddit

  try {
    // Step 1: Check if a question is already assigned for today
    const existingQotd = await prisma.questionOfTheDay.findUnique({
      where: { date: today },
      include: { 
        question: {
          include: {
            tags: true, // Include the tags of the associated question
          }
        }
      }, 
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

    try {
      console.log("posting to reddit yippee")
      const post = await reddit.getSubreddit(subredditName).submitSelfpost({
        title: selectedQuestion.text,
        text: `For question https://www.hashtagdeep.com/${selectedQuestion.id}`
      });
      console.log(`Posted successfully! View it here: ${post.url}`);
    } catch (error) {
      console.error('Failed to post question of the day:', error);
    }

    return selectedQuestion; // Return the selected question
  } catch (error) {
    console.error('Error fetching question of the day:', error);
    throw new Error('Could not fetch question of the day');
  }
}
