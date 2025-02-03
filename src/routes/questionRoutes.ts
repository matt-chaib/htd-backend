import express, {Request, Response} from 'express'
import prisma from '../prismaClient.js';
import { PrismaClient } from "@prisma/client";
import { QuestionService } from '../service/questionService.js';
import { ApiClient } from '../service/ApiClient.js';
import Snoowrap from 'snoowrap';

const prismaClient = new PrismaClient();
const reddit = new Snoowrap({
  userAgent: "QOTD Bot by /u/Free_Cash8050", // A description of your bot
  clientId: "pRo9hPnXAcuTWnaYYXjVhA",
  clientSecret: `${process.env.REDDIT_SECRET}`,
  username: "Free_Cash8050",
  password: `${process.env.REDDIT_ACC_PASS}`,
});
const apiClient = new ApiClient(prismaClient, reddit);
const questionService = new QuestionService(apiClient, reddit);

const router = express.Router();

router.get('/', async (req: Request, res: Response) => { 
  const { limit } = req.query; // Extract the `limit` query parameter
  
  // Validate and parse the limit
  const parsedLimit = limit ? parseInt(limit as string, 10) : 0;
  if ((limit && isNaN(parsedLimit)) || !parsedLimit) {
    res.status(400).json({ error: 'Invalid limit parameter' });
    return
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        date_used: { not: null }, // Only include questions where date_used is not null
      },
      include: {
        tags: true, // Include the tags of each question
      },
      orderBy: [
        {
          date_used: {
            sort: 'desc', // Sort valid dates in ascending order, `null` will appear last
          },
        },
      ],
      take: parsedLimit, // Apply the limit
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get a specific question by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
      include: { tags: true }, // Include tags if needed
    });

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:',error );
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

router.get('/api/question-of-the-day', async (req, res) => {
    try {
      const question = await questionService.getQuestionOfTheDay();
      res.json(question);
    }  catch (err: unknown) {
      let errorMessage = 'Could not fetch question of the day. Something went wrong';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
    
      res.status(500).json({ error: errorMessage });
    }
  });



// router.post('/', (req, res) => { })

// router.put('/:id', (req, res) => { })

// router.delete('/:id', (req, res) => { })

export default router