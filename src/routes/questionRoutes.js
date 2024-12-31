import express from 'express'
import prisma from '../prismaClient.js';
import { getQuestionOfTheDay } from '../service/questionService.js';

const router = express.Router();

router.get('/', async (req, res) => { 
  const { limit } = req.query; // Extract the `limit` query parameter
  
  // Validate and parse the limit
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  if (limit && isNaN(parsedLimit)) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
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
            sort: 'asc', // Sort valid dates in ascending order, `null` will appear last
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
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:',error );
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

router.get('/api/question-of-the-day', async (req, res) => {
    try {
      const question = await getQuestionOfTheDay();
      res.json(question);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



// router.post('/', (req, res) => { })

// router.put('/:id', (req, res) => { })

// router.delete('/:id', (req, res) => { })

export default router