import express from 'express'
import prisma from '../prismaClient.js';


const router = express.Router();

router.get('/', async (req, res) => { 
    console.log(req, res)
    const questions = await prisma.question.findMany({
        include: {
            tags: true,
          },
    })

    res.json(questions)
})

// router.post('/', (req, res) => { })

// router.put('/:id', (req, res) => { })

// router.delete('/:id', (req, res) => { })

export default router