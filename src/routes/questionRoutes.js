import express from 'express'
import prisma from '../prismaClient.js';
import { getQuestionOfTheDay } from '../service/questionService.js';

const router = express.Router();

router.get('/', async (req, res) => { 
    console.log(req, res)
    const questions = await prisma.question.findMany({
        include: {
          tags: true, // Include the tags of each question
        },
        orderBy: [
          {
            date_used: {
              sort: 'asc', // Sort valid dates in ascending order, `null` will appear last
              nulls: 'last', // Ensures `null` values are placed at the end
            },
          },
        ],
      });

    res.json(questions)
})

router.get('/question-of-the-day', async (req, res) => {
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