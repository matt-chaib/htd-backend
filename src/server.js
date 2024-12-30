import express from 'express';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cors from "cors";
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/questionRoutes.js'

const app = express();

const PORT = process.env.PORT || 5000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)


app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes)
app.use('/questions', todoRoutes)

console.log("testing")
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))