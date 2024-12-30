import express from 'express'
import prisma from '../prismaClient.js';
import { getQuestionOfTheDay } from '../service/questionService.js';

const router = express.Router();

router.get('/', async (req, res) => { 
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
      });

    res.json(questions)
})

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
    console.error('Error fetching question:');
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