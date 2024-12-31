import express from 'express';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cors from "cors";
import questionRoutes from './routes/questionRoutes.js'

const app = express();

const PORT = process.env.PORT || 5000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)


const allowedOrigins = [
  'http://localhost:3000',
  'https://hashtagdeep.com',
  'https://www.hashtagdeep.com',
];

console.log(PORT)

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) { // Allows no-origin requests (e.g., from Postman or CURL)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/questions', questionRoutes)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))